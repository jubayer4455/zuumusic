Add-Type -AssemblyName System.Drawing

function Make-Icon($size, $path) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 12, 12, 14))
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)
    
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 30, 215, 96)), ($size * 0.12)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    
    $p1 = New-Object System.Drawing.PointF ($size * 0.25), ($size * 0.28)
    $p2 = New-Object System.Drawing.PointF ($size * 0.75), ($size * 0.28)
    $p3 = New-Object System.Drawing.PointF ($size * 0.36), ($size * 0.72)
    $p4 = New-Object System.Drawing.PointF ($size * 0.75), ($size * 0.72)
    
    $g.DrawLine($pen, $p1, $p2)
    $g.DrawLine($pen, $p2, $p3)
    $g.DrawLine($pen, $p3, $p4)
    
    $dotBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 0, 242, 254))
    $dotSize = ($size * 0.12)
    $g.FillEllipse($dotBrush, ($size * 0.75 - $dotSize/2), ($size * 0.28 - $dotSize/2), $dotSize, $dotSize)
    
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created: $path"
}

Make-Icon 192 "public/icon-192.png"
Make-Icon 512 "public/icon-512.png"
