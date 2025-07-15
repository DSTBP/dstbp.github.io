import datetime
import re
from pathlib import Path


class MarkdownProcess:
    def __init__(self, input_path, output_path=None):
        # 将输入路径转换为Path对象
        self.input_path = Path(input_path)
        # 如果未指定输出路径，使用输入路径的Path对象
        self.output_path = Path(output_path) if output_path else self.input_path

    def process_markdown_images(self, content):
        """
        处理 Markdown 文件中的图片链接，将其转换为居中显示的HTML格式，输出文件路径，默认为None（覆盖原文件）
        """
        
        # 定义匹配 Markdown 图片链接的正则表达式
        image_pattern = r'\!\[(.*?)\]\((.*?\.(jpg|jpeg|png|gif|webp))\)'
        
        # 替换函数：将匹配到的Markdown图片转换为HTML居中格式
        def replace_image(match):
            alt_text = match.group(1)
            url = match.group(2)
            return f'<center><img src="https://dstbp.com/data/imgs/posts/GSC/" width="600" alt="{alt_text}"></center>'
        
        # 执行替换
        return re.sub(image_pattern, replace_image, content)


    def add_yaml_front_matter(self, content, title="未命名文章", top=0, recommend=0, date=None, tags=None, categories=None, keywords=None):
        """
        在 Markdown 内容前添加YAML元数据
        """
        # 如果未提供日期，使用当前日期
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # 构建YAML元数据
        yaml = "---\n"
        yaml += f"title: \"{title}\"\n"
        yaml += f"top: {top}\n"
        yaml += "toc: true\n"
        yaml += f"recommend: {recommend}\n"

        # 添加keywords
        yaml += "keywords:\n"
        if keywords:
            for keyword in keywords:
                yaml += f"  - {keyword}\n"
        else:
            # 默认keywords
            yaml += "  - 图形替换\n"
            yaml += "  - 古典密码\n"
            yaml += "  - crypto\n"
            yaml += "  - 密码学\n"
        yaml += f"date: {date}\n"
        yaml += "thumbnail: https://dstbp.com/data/imgs/posts/GSC/Thumbnail.png\n"
        
        if tags:
            yaml += f"tags: {', '.join(tags)}\n"
        else:
            yaml += "tags: 密码学\n"
        
        if categories:
            yaml += f"categories: [{', '.join(categories)}]\n"
        else:
            yaml += "categories: [密码学,古典密码]\n"
        
        yaml += "mathjax: true\n"
        yaml += "---\n\n"
        
        # 检查原内容是否已有YAML头部
        if content.startswith("---\n"):
            # 移除原有YAML头部
            end_of_yaml = content.find("---\n", 4)  # 从第4个字符开始查找第二个"---"
            if end_of_yaml != -1:
                content = content[end_of_yaml + 4:].lstrip()  # 保留第二个"---"之后的内容
        
        return yaml + content

    def process_empty_lines(self, content):     # 有问题
        """ 处理Markdown内容中的空行，添加<br>标签 """
        return re.sub(r'(?m)^[ \t]*\n', r'<br>\n', content)

    def extract_file(self):
        if not self.input_path.exists() or not self.input_path.is_file():
            print(f"错误：找不到输入文件 '{self.input_path}'")
            return

        with open(self.input_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return content

    def save_file(self, content):
        with open(self.output_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"处理完成！文件已保存至: {self.output_path}")


    def main(self):
        content = self.extract_file()
        
        # 添加 YAML 元数据
        processed_content = self.add_yaml_front_matter(
            content,
            top=0, 
            recommend=0,
            title='[古典密码] 图像替换密码',
            date='2025-07-14 12:30:00',
            tags=['密码学'],
            categories=['密码学','古典密码'],
            keywords=['图形替换', '古典密码', 'crypto', '密码学']
        )

        # 处理图片格式
        processed_content = self.process_markdown_images(processed_content)

        # 处理空行
        # processed_content = self.process_empty_lines(processed_content)

        self.save_file(processed_content)

if __name__ == "__main__":
    input_path = r"D:\Utils\NeatDownloadManager\Downloads\[古典密码] 图像替换密码.md"
    output_path = r"D:\Utils\NeatDownloadManager\Downloads\4.md"

    mp = MarkdownProcess(input_path, output_path)
    mp.main()
