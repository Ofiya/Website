# PowerShell script to add hamburger menus to remaining pages

$hamburgerHTML = @'
            <button class="hamburger" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
'@

$hamburgerJS = @'
            // Hamburger menu toggle
            const hamburger = document.querySelector('.hamburger');
            const navRight = document.querySelector('.nav-right');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            if (hamburger && navRight) {
                hamburger.addEventListener('click', () => {
                    hamburger.classList.toggle('active');
                    navRight.classList.toggle('active');
                });
                
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        hamburger.classList.remove('active');
                        navRight.classList.remove('active');
                    });
                });
                
                document.addEventListener('click', (e) => {
                    if (!hamburger.contains(e.target) && !navRight.contains(e.target)) {
                        hamburger.classList.remove('active');
                        navRight.classList.remove('active');
                    }
                });
            }
            
'@

# Update services.html
$content = Get-Content "services.html" -Raw
$content = $content -replace '(<a class="logo".*?</a>)', "`$1`n$hamburgerHTML"
$content = $content -replace "(document\.addEventListener\('DOMContentLoaded', function\(\) \{)", "`$1`n$hamburgerJS"
Set-Content "services.html" -Value $content

# Update projects.html
$content = Get-Content "projects.html" -Raw
$content = $content -replace '(<a class="logo".*?</a>)', "`$1`n$hamburgerHTML"
$content = $content -replace "(document\.addEventListener\('DOMContentLoaded', function\(\) \{)", "`$1`n$hamburgerJS"
Set-Content "projects.html" -Value $content

# Update contact.html
$content = Get-Content "contact.html" -Raw
$content = $content -replace '(<a class="logo".*?</a>)', "`$1`n$hamburgerHTML"
$content = $content -replace "(document\.addEventListener\('DOMContentLoaded', function\(\) \{)", "`$1`n$hamburgerJS"
Set-Content "contact.html" -Value $content

Write-Host "Hamburger menus added to services, projects, and contact pages!" -ForegroundColor Green
