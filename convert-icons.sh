#!/bin/bash

# 显示当前目录
echo "当前目录: $(pwd)"

# 确保 menubar 目录存在
if [ ! -d "src/assets/images/menubar" ]; then
    echo "错误: menubar 目录不存在"
    exit 1
fi

# 进入 menubar 目录
cd src/assets/images/menubar

# 删除旧的 PNG 文件
rm -f *.png

# 显示当前 SVG 文件
echo "当前 SVG 文件:"
ls -l *.svg

# 转换所有 SVG 到 PNG
for file in *-dark.svg; do
    if [ -f "$file" ]; then
        # 将 -dark 替换为 -template
        name="${file%-dark.svg}-template.png"
        echo "转换 $file 到 $name"
        convert -background none -density 288 "$file" -resize 18x18 "$name"
    fi
done

# 转换空白图标
if [ -f "empty.svg" ]; then
    echo "转换 empty.svg 到 empty.png"
    convert -background none -density 288 empty.svg -resize 18x18 empty.png
fi

# 显示生成的文件
echo "生成的 PNG 文件:"
ls -l *.png

echo "转换完成！" 