#!/bin/bash

# 创建必要的目录
mkdir -p build/icons/icon.iconset

# 生成不同尺寸的图标
sips -z 16 16 icon.png --out build/icons/icon.iconset/icon_16x16.png
sips -z 32 32 icon.png --out build/icons/icon.iconset/icon_16x16@2x.png
sips -z 32 32 icon.png --out build/icons/icon.iconset/icon_32x32.png
sips -z 64 64 icon.png --out build/icons/icon.iconset/icon_32x32@2x.png
sips -z 128 128 icon.png --out build/icons/icon.iconset/icon_128x128.png
sips -z 256 256 icon.png --out build/icons/icon.iconset/icon_128x128@2x.png
sips -z 256 256 icon.png --out build/icons/icon.iconset/icon_256x256.png
sips -z 512 512 icon.png --out build/icons/icon.iconset/icon_256x256@2x.png
sips -z 512 512 icon.png --out build/icons/icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out build/icons/icon.iconset/icon_512x512@2x.png

# 生成 icns 文件
iconutil -c icns build/icons/icon.iconset

# 生成 Windows 图标
# 首先创建临时目录存放不同尺寸的 PNG
mkdir -p build/icons/ico_temp

# 生成 Windows 所需的各种尺寸
sips -z 256 256 icon.png --out build/icons/ico_temp/icon_256.png
sips -z 128 128 icon.png --out build/icons/ico_temp/icon_128.png
sips -z 64 64 icon.png --out build/icons/ico_temp/icon_64.png
sips -z 48 48 icon.png --out build/icons/ico_temp/icon_48.png
sips -z 32 32 icon.png --out build/icons/ico_temp/icon_32.png
sips -z 16 16 icon.png --out build/icons/ico_temp/icon_16.png

# 使用 ImageMagick 将所有尺寸合并为一个 ICO 文件
convert build/icons/ico_temp/icon_{256,128,64,48,32,16}.png build/icons/icon.ico

# 清理临时文件
rm -rf build/icons/icon.iconset
rm -rf build/icons/ico_temp 