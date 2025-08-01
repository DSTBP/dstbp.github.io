import re
import datetime
from pathlib import Path


class MarkdownProcess:
    def __init__(self, input_path, output_path: str=None):
        # 输入路径
        self.input_path = Path(input_path)
        # 未指定输出路径，使用输入路径
        self.output_path = Path(output_path) if output_path else self.input_path

    def process_markdown_images(self, content: str, parent_dic: str, img_name: list = None):
        """
        图片链接转换为居中显示的 HTML 格式，支持自定义图片名和注释
        """
        # 初始化空列表
        img_name = img_name or []
        
        # 定义匹配 Markdown 图片的正则表达式
        image_pattern = r'\!\[(.*?)\]\((.*?\.(jpg|jpeg|png|gif|webp))\)'
        
        # 记录当前处理到的图片索引
        image_index = 0
        
        def replace_image(match):
            nonlocal image_index  # 使用外部变量记录索引
            alt_text = match.group(1)
            
            # 构建图片路径
            img_path = f"https://dstbp.com/data/imgs/posts/{parent_dic}/"
            if image_index < len(img_name) and img_name[image_index]:
                img_path += img_name[image_index]
            
            # 自增索引，处理下一张图片
            image_index += 1
            
            # 返回 HTML 格式（居中图片 + 楷体注释）
            return (
                f'<center><img src="{img_path}" width="600" alt="{alt_text}"></center>\n'
            )
        
        return re.sub(image_pattern, replace_image, content)

    def add_yaml_front_matter(self, content, title="未命名文章", top=0, recommend=0, date=None, tags=None, categories=None, keywords=None):
        """
        移除原有 YAML 头部, 添加 YAML 元数据
        """
        # 如果未提供日期，使用当前日期
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # 构建 YAML 元数据
        yaml = "---\n"
        yaml += f"title: \"{title}\"\n"
        yaml += f"top: {top}\n"
        yaml += "toc: true\n"
        yaml += f"recommend: {recommend}\n"

        # 添加 keywords
        yaml += "keywords:\n"
        if keywords:
            for keyword in keywords:
                yaml += f"  - {keyword}\n"
        else:
            # 默认 keywords
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
        
        # 检查原内容是否已有 YAML 头部
        if content.startswith("---\n"):
            # 移除原有 YAML 头部
            end_of_yaml = content.find("---\n", 4)  # 从第4个字符开始查找第二个"---"
            if end_of_yaml != -1:
                content = content[end_of_yaml + 4:].lstrip()  # 保留第二个"---"之后的内容
        
        return yaml + content

    def bold_titles(self, content: str):
        """
        标题加粗
        """
        
        # 正则表达式匹配标题行
        pattern = r'^(#{1,6})\s+(.*?)\s*$'
        
        # 在标题内容前后添加**
        def bold(match):
            return f'{match.group(1)} **{match.group(2)}**'
        
        # 执行替换，使用多行模式确保^匹配每行开头
        new_content = re.sub(pattern, bold, content, flags=re.MULTILINE)
        
        return new_content

    def add_br_before_h1(self, content: str):
        """
        在一级标题前添加 <br> 标签
        """
        # 正则表达式匹配一级标题行
        pattern = r'^(#{1})\s+(.*?)\s*$'
        
        def add_break(match):
            return f'<br>\r\n{match.group(1)} {match.group(2)}'
        
        return re.sub(pattern, add_break, content, flags=re.MULTILINE)

    def format_captions(self, content: str) -> str:
        """
        将Markdown中形如"图 X.X ..."或"表 X.X ..."的注释转换为居中楷体格式
        """
        # 正则表达式匹配"图 X.X ..."或"表 X.X ..."格式的注释
        pattern = r'(图|表)\s+\d+\.\d+\s+.*?(?=\n|$|。|，|；|,|;)'
        
        # 匹配到的注释转换为指定 HTML 格式
        def replace_caption(match):
            caption = match.group(0)
            # 返回包装后的HTML格式
            return f'<center style="margin-top: 10px; margin-bottom: 18px;"><span style="font-family:楷体;font-size:14px;">{caption}</span></center>'
        
        # 执行替换，全局匹配所有符合规则的注释
        new_content = re.sub(pattern, replace_caption, content)
        
        return new_content

    def extract_file(self):
        '''
        提取 Markdown 内容
        '''
        if not self.input_path.exists() or not self.input_path.is_file():
            print(f"错误：找不到输入文件 '{self.input_path}'")
            return

        with open(self.input_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return content

    def save_file(self, content):
        '''
        保存文件
        '''
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
        processed_content = self.process_markdown_images(
            processed_content, 
            parent_dic='smsc',
            img_name = ['ClassicalPigpenCipher2.jpg', 'ClassicalPigpenCipher1.jpg', 'VariantPigpenCipher.png', 'VariantPigpenCipher2.png', 'VariantPigpenCipher3.png', 'StandardGalactic.png', 'TheDancingMen.png', 'Semaphore.jpg', 'IMSF.png', 'AncientEgyptianHieroglyphics.png', 'Braille1.png', 'Braille2.png', 'Braille3.jpg', 'ChineseBraille1.png', 'ChineseBraille2.png', 'ChineseBraille3.png', 'Braille4.png', 'Braille5.png', 'ShadokCipher2.png', 'ShadokCipher1.jpg', 'ShadokCipher3.png', 'DaedricAlphabet.png', 'DragonLanguage.jpg', 'Draconic.png', 'Alien.jpg', 'AlienSpaceLanguage1.png', 'AlienSpaceLanguage2.png', 'Klingon.png', 'Dothraki.jpg', 'Simlish.png', 'Pokemon.png', 'ChromaticSubstitutionCiphers.png', 'CompoundMotivicCiphers.png', 'Zuish.png', 'Elvish1.png', 'Quenya1.png', 'Quenya2.png', 'Quenya3.png', 'Sindarin1.png', 'Sindarin2.png', 'Atlantean.png', 'AncientAlpahabet.png', 'Zentradi.png', 'Covenant.png', 'Betamaze.png', 'Birds.jpg', 'DaggersAlphabet.png', 'Dotsies.jpg', 'Dorabella.jpg', 'Enochian.jpg', 'Genshin.jpg', 'Minimoys.png', 'BillSymbol.jpg', 'hexahue.png', 'Cistercian.png', 'Hylian1.png', 'Hylian2.jpg', 'Hylian3.png', 'Sheikah.jpg', 'Gerudo.png', 'Cat.jpg', 'Aurebesh.png', 'Krypton.png', 'Wakandan.png']
        )

        # 处理注释
        processed_content = self.format_captions(processed_content)

        # 处理标题
        processed_content = self.bold_titles(processed_content)

        # 处理空行
        # processed_content = self.add_br_before_h1(processed_content)

        # 保存文件
        self.save_file(processed_content)

if __name__ == "__main__":
    input_path = r"D:\Utils\NeatDownloadManager\Downloads\[古典密码] 隐写式单表替换密码.md"
    output_path = r"D:\Utils\NeatDownloadManager\Downloads\4.md"

    mp = MarkdownProcess(input_path, output_path)
    mp.main()