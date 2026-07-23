# Fabric Workflow Scheduling Setup Guide

## Overview
This guide walks you through setting up **scheduled automation** for your Assessment PDF ingestion workflow in Microsoft Fabric.

**Workflow Steps:**
1. Sync PDFs from OneDrive/SharePoint → Fabric Lakehouse (daily)
2. Parse PDFs → Delta Tables (after sync)
3. Validate data quality
4. Send notifications (optional)

---

## Prerequisites

✅ **Completed:**
- OneDrive sync script (`onedrive_to_fabric_sync.py`)
- PDF parsing notebook (`parse_assessment_pdfs.ipynb`)
- Orchestration notebook (`orchestrate_assessment_workflow.ipynb`)
- Fabric workspace with ManagedServiceData lakehouse

📋 **Required Information:**
- Azure App Registration Client ID
- Azure Tenant ID
- OneDrive/SharePoint folder ID for source PDFs
- Fabric Workspace ID: `0f895a7e-09c6-4645-8b47-d272bc687b8a`

---

## Step 1: Upload Orchestration Notebook to Fabric

### Option A: Via Fabric Portal (Recommended)

1. Open [Fabric Portal](https://app.fabric.microsoft.com)
2. Navigate to your workspace
3. Click **+ New** → **Notebook**
4. Name it: `orchestrate_assessment_workflow`
5. Delete the default cells
6. Open the local file:
   ```
   c:\WebsiteNew\website\New folder\0f895a7e-09c6-4645-8b47-d272bc687b8a\SynapseNotebook\b944343f-b94f-41eb-9d0a-dc6b18b5f4a9\orchestrate_assessment_workflow\orchestrate_assessment_workflow.ipynb
   ```
7. Copy all cells and paste into the Fabric notebook
8. **Attach lakehouse:** ManagedServiceData
9. Save the notebook

### Option B: Via VS Code Fabric Extension

1. Open VS Code with Fabric extension installed
2. Navigate to the orchestration notebook folder
3. Right-click `orchestrate_assessment_workflow.ipynb`
4. Select **Publish to Fabric**
5. Choose your workspace
6. Attach lakehouse: ManagedServiceData

---

## Step 2: Configure Authentication & Settings

### Update Configuration in Orchestration Notebook

Edit Cell 2 (CONFIGURATION section):

```python
# Workflow settings
WORKFLOW_CONFIG = {
    "sync_enabled": True,
    "parse_enabled": True,
    "validation_enabled": True,
    "notification_enabled": False,  # Set to True once email is configured
    "notification_email": "your-email@company.com",  # Update with actual email
}

# OneDrive sync settings
ONEDRIVE_CONFIG = {
    "client_id": "your-actual-client-id",  # From Azure App Registration
    "tenant_id": "your-actual-tenant-id",  # From Azure AD
    "scopes": ["https://graph.microsoft.com/.default"],
    "source_folder_id": "your-onedrive-folder-id",  # OneDrive folder with PDFs
    "lakehouse_base_path": "Files",
}
```

**Finding your values:**

- **Client ID & Tenant ID**: 
  - Azure Portal → App Registrations → Your app → Overview
  
- **OneDrive Folder ID**:
  - Open OneDrive in browser
  - Navigate to your assessment PDFs folder
  - Check URL: `https://onedrive.live.com/?id=FOLDER_ID_HERE`
  - Or use Graph Explorer to find it

### Test the Configuration

Run the notebook manually once to ensure:
1. Authentication works
2. PDFs sync correctly
3. Parsing completes successfully
4. Data validates properly

---

## Step 3: Set Up Scheduled Execution

### Method 1: Fabric Notebook Scheduling (Simplest)

1. Open `orchestrate_assessment_workflow` notebook in Fabric
2. Click **Run** → **Schedule run**
3. Configure schedule:
   - **Name**: Daily Assessment Ingestion
   - **Frequency**: Daily
   - **Time**: 2:00 AM (UTC) - *Adjust to your timezone*
   - **Time zone**: Select your timezone
   - **Start date**: Today
   - **End date**: (Leave blank for continuous)
4. Click **Apply**

**Pros:**
- Simple, built-in to Fabric
- No additional configuration needed
- Easy to monitor in Fabric UI

**Cons:**
- Limited to notebook-only execution
- Basic error handling

---

### Method 2: Fabric Data Pipeline (Recommended for Production)

Create a more robust pipeline with error handling and notifications.

#### 2.1 Create New Pipeline

1. Fabric Portal → Your workspace
2. Click **+ New** → **Data Pipeline**
3. Name: `Assessment_Workflow_Pipeline`

#### 2.2 Add Notebook Activity

1. In pipeline designer, add **Notebook** activity
2. Configure:
   - **Name**: Run Assessment Workflow
   - **Notebook**: orchestrate_assessment_workflow
   - **Lakehouse**: ManagedServiceData
   - **Timeout**: 2 hours

#### 2.3 Add Error Handling

1. Click the notebook activity
2. Go to **Settings** tab
3. Add **On Failure** activity:
   - **Email notification** (if configured)
   - **Log to table** for audit trail

#### 2.4 Schedule the Pipeline

1. Click **Schedule** in pipeline toolbar
2. Configure:
   - **Name**: Daily 2AM Execution
   - **Frequency**: Daily
   - **Every**: 1 day
   - **Start time**: 02:00
   - **Time zone**: Your timezone
3. Save schedule

---

### Method 3: Azure Data Factory / Logic Apps (Advanced)

For complex scenarios with external triggers:

1. **Create Logic App** that triggers on:
   - File upload to SharePoint/OneDrive
   - HTTP webhook from external system
   - Custom schedule with advanced conditions

2. **Logic App calls Fabric REST API** to execute notebook:
   ```
   POST https://api.fabric.microsoft.com/v1/workspaces/{workspaceId}/notebooks/{notebookId}/jobs
   ```

3. **Monitor execution** and send custom notifications

---

## Step 4: Monitoring & Alerts

### Built-in Monitoring

1. **Fabric Monitoring Hub**:
   - Go to Fabric Portal → Monitoring Hub
   - View all scheduled runs
   - Check execution history
   - Investigate failures

2. **Notebook Run History**:
   - Open notebook → Run history
   - View detailed logs
   - Download outputs

### Custom Logging

The orchestration notebook saves workflow summaries to:
```
Files/workflow_logs/{timestamp}_summary.json
```

Query logs with:
```python
# View recent workflow runs
logs_df = spark.read.json("Files/workflow_logs/*.json")
display(logs_df.orderBy("timestamp", ascending=False).limit(10))
```

### Set Up Alerts

**Option A: Fabric Alerts**
1. Create alert rules in Monitoring Hub
2. Configure notifications for:
   - Failed executions
   - Long-running jobs (>1 hour)
   - Data quality issues

**Option B: Custom Email Notifications**

Enable in orchestration notebook:
```python
WORKFLOW_CONFIG = {
    "notification_enabled": True,
    "notification_email": "team@company.com"
}
```

Then implement email sender using:
- **Azure Logic Apps** (easiest)
- **SendGrid API**
- **Office 365 Mail API**

---

## Step 5: Validate Scheduled Execution

### After First Scheduled Run

1. **Check execution completed**:
   - Monitoring Hub → Check status
   - Verify completion time

2. **Validate data ingestion**:
   ```sql
   -- Check recent ingestions
   SELECT 
       assessment_type,
       COUNT(*) as total,
       MAX(ingested_at) as last_ingestion
   FROM security_assessment_reports
   GROUP BY assessment_type
   ```

3. **Review workflow logs**:
   ```python
   # Load latest summary
   latest_log = spark.read.json("Files/workflow_logs/*.json") \
       .orderBy("timestamp", ascending=False) \
       .first()
   
   print(latest_log.workflow_status)
   print(latest_log.validation_results)
   ```

4. **Verify PDF sync**:
   - Check Files/security_assessment/{today}/
   - Check Files/copilot_readiness/{today}/
   - Check Files/copilot_assessment/{today}/

---

## Troubleshooting

### Common Issues

**1. Authentication Failures**
- Ensure Azure App has correct permissions:
  - `Files.Read.All` for OneDrive
  - `Sites.Read.All` for SharePoint
- Re-authenticate if token expired

**2. Notebook Timeout**
- Increase timeout in pipeline settings
- Default: 3600s (1 hour)
- Adjust based on PDF volume

**3. Missing PDFs**
- Verify OneDrive folder ID is correct
- Check file categorization logic
- Ensure PDFs are named correctly

**4. Data Quality Issues**
- Run validation cell manually
- Check NULL values in reports
- Review PDF parsing logs

### Debug Mode

Enable verbose logging:
```python
# Add to orchestration notebook
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

## Maintenance

### Weekly Tasks
- [ ] Review workflow logs
- [ ] Check data quality metrics
- [ ] Verify all PDFs ingested

### Monthly Tasks
- [ ] Review error patterns
- [ ] Optimize parsing logic if needed
- [ ] Archive old workflow logs
- [ ] Update authentication tokens if needed

### Quarterly Tasks
- [ ] Review schedule timing (adjust if needed)
- [ ] Update assessment type categories
- [ ] Performance tuning for large PDF sets

---

## Next Steps

Once scheduling is working:

1. **Add Data Quality Dashboards**
   - Create Power BI reports from Delta tables
   - Monitor ingestion metrics over time

2. **Implement Advanced Notifications**
   - Email summaries to stakeholders
   - Slack/Teams integration for failures

3. **Optimize Performance**
   - Parallel PDF processing
   - Incremental ingestion (only new files)
   - Caching for large PDFs

4. **Extend Workflow**
   - Add ML-based anomaly detection
   - Auto-generate compliance reports
   - Integration with ticketing systems

---

## Support

For issues or questions:
- Fabric Documentation: https://learn.microsoft.com/fabric
- GitHub Issues: [Your repo]
- Internal Support: [Your team contact]

---

**Created:** 2026-06-15  
**Version:** 1.0  
**Maintained by:** Your Team
