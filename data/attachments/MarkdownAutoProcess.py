import re
import argparse
from pathlib import Path

def process_markdown_images(input_file, output_file=None):
    """
    处理 Markdown 文件中的图片链接，将其转换为居中显示的HTML格式，输出文件路径，默认为None（覆盖原文件）
    """
    # 读取Markdown文件内容
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 定义匹配Markdown图片链接的正则表达式
    # 匹配格式：![alt_text](url)
    image_pattern = r'\!\[(.*?)\]\((.*?\.(jpg|jpeg|png|gif|webp))\)'
    
    # 替换函数：将匹配到的Markdown图片转换为HTML居中格式
    def replace_image(match):
        alt_text = match.group(1)
        url = match.group(2)
        return f'<center><img src="{url}" width="600" alt="{alt_text}"></center>'
    
    # 执行替换
    processed_content = re.sub(image_pattern, replace_image, content)
    
    # 确定输出文件路径
    if output_file is None:
        output_file = input_file
    
    # 写入处理后的内容
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(processed_content)
    
    print(f"处理完成！文件已保存至: {output_file}")


if __name__ == "__main__":
    input_path = r"D:\Utils\NeatDownloadManager\Downloads\[古典密码] 图像替换密码.md"
    output_path = r"D:\Utils\NeatDownloadManager\Downloads\1.md"
    process_markdown_images(input_path, output_path)