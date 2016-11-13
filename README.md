JSDoc
======

执行方式

    $ > npm run doc

### 什么是JSDoc

JSDoc是一个根据javascript文件中注释信息，生成JavaScript应用程序或库、模块的API文档 的工具。JSDoc的文档可以参考 [http://usejsdoc.org/](http://usejsdoc.org/)

### 为什么要使用JSDoc

1. 首先JSDoc定义了一套注释规范，要自动生成文档就必须按照JSDoc的规范来写注释，这样可以统一注释规范。
2. 写完组件后需要去更新组件的文档，相当于要维护两套东西，而使用JSDoc以后，只要更新组件的注释，就能同步组件文档，可以减少对组件文档的维护。

### JSDoc规范

##### 类描述信息

```javascript
    /**
      * 书
      * 
      * @author 夏苒 <qiuyan.mqy@alibaba-inc.com>
      * @version v1.0.0
      * 
      * @example const book = new Book(title, author);
      */
    class Book {
        
    }
```

##### 构造函数

```javascript
    /**
     * 构造一本书
     * @param options {object} 选项
     * @param [options.title] {string} 标题
     * @param [options.author] {string} 作者
     * @returns {Book}
     */
    constructor(options) {
        this.title = options.title;
        this.author = options.author;
    }
```

##### 方法

```javascript
    /**
     * 设置书的标题
     * @param {string} title='' - 新标题
     */
    setTitle(title) {
        this.tile = title;
    }
```

### jsdoc2md

jsdoc-to-markdown 是一个可以将jsdoc生成markdown的工具，你可以使用工具提供的模版，也可以自定义模版。具体安装方式可以参考jsdoc2md的文档 [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown/blob/master/docs/API.md) 和 [jsdoc-to-markdown wiki](https://github.com/jsdoc2md/jsdoc-to-markdown/wiki)，基本上可以解决大部分问题。

### gulpfile

首先根据文档的提示，我们先把gulp的架子搭好

```javascript
    gulp.task('docs', function () {
        return gulp.src('./src/**/*.js')
        .pipe(gulpJsdoc2md({ template: fs.readFileSync('./templates/readme.hbs', 'utf8') }))
        .on('error', function (err) {
            gutil.log(gutil.colors.red('jsdoc2md failed'), err.message)
        })
        .pipe(rename(function (path) {
        path.extname = '.md'
        }))
        .pipe(gulp.dest('api'))
    });
```

然后可以开始编写模版文件readme.hbs了

### readme.hbs

readme.hbs是基于[handlebar](http://handlebarsjs.com/)模版引擎的模版文件，基本的写法很简单，只要写上

```javascript
    {{>main}}
```

就能生成如下文档

```markdown
<a name="Book"></a>

## Book
书

**Kind**: global class  
**Version**: v1.0.0  
**Author:** 夏苒 <qiuyan.mqy@alibaba-inc.com>  

* [Book](#Book)
    * [new Book(options)](#new_Book_new)
    * [.getTitle()](#Book+getTitle) ⇒ <code>string</code>
    * [.getAuthor()](#Book+getAuthor) ⇒ <code>string</code>
    * [.setTitle(title)](#Book+setTitle)
    * [.setAuthor(author)](#Book+setAuthor)

<a name="new_Book_new"></a>

### new Book(options)
构造一本书


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | 选项 |
| [options.title] | <code>string</code> | 标题 |
| [options.author] | <code>string</code> | 作者 |

<a name="Book+getTitle"></a>

### book.getTitle() ⇒ <code>string</code>
获取标题

**Kind**: instance method of <code>[Book](#Book)</code>  
<a name="Book+getAuthor"></a>

### book.getAuthor() ⇒ <code>string</code>
获取作者

**Kind**: instance method of <code>[Book](#Book)</code>  
<a name="Book+setTitle"></a>

### book.setTitle(title)
设置书的标题

**Kind**: instance method of <code>[Book](#Book)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| title | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 新标题 |

<a name="Book+setAuthor"></a>

### book.setAuthor(author)
设置书的作者

**Kind**: instance method of <code>[Book](#Book)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| author | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 新作者 |

```

然而跟我们的文档规范还是有点不一样，所以我们只能自定义模版。

### 自定义模版

首先可以参考文档 [docs](https://github.com/jsdoc2md/dmd/tree/master/partials)，上面用到的{{>main}}其实就是文档中的main.hbs。我们可以看到main其实是由几部分组成：

```javascript
    {{>main-index~}}
    {{>all-docs~}}
```

然后文档中也有main-index和all-docs两个文件夹，里面有main-index.hbs和all-docs.hbs两个入口文件，所以其实这就是一个树状结构，只要我们将里面的内容重写了即可。于是便得到了最基本的模版文件

```javascript
    {{#orphans ~}}

    {{>header~}}

    {{>description~}}
    {{#if author}}{{#each author}}**作者:** {{{inlineLinks this}}}  
    {{/each}}{{/if~}}
    {{#if version}}**版本:** {{inlineLinks version}}  
    {{/if~}}

    ### API

    {{#children inherited=undefined ~}}

    ##### {{this.memberof}}.{{this.name}} {{>description~}}

    {{#if params}}

    {{tableHead params "name|属性" "description|说明" "type|类型" "defaultvalue|默认值" ~}}

    {{#tableRow params "name" "description" "type" "defaultvalue" ~}}
    | {{#if @col1}}{{>param-table-name}} | {{/if~}}
    {{#if @col2}}{{{stripNewlines (inlineLinks description)}}} |{{/if~}}
    {{#if @col3}}{{>linked-type-list types=type.names delimiter=" &#124; " }} | {{/if~}}
    {{#if @col4}}{{>defaultvalue}} | {{/if}}
    {{/tableRow}}

    {{/if}}

    {{/children~}}

    {{/orphans~}}
```

### orphans - Iterates over all identifiers with no parent (modules and globals)

包含所有标识，具体包含的内容可以通过

    $ > jsdoc2md --json src/book.js

看到，其实就是会根据注释生成一个json对象，然后根据json对象来生成渲染readme.hbs的模版。

### header

即文档的首部，这里不需要作修改，则使用默认模版。

### description

组件描述，也不需要修改。

### author & version

作者和版本，因为默认模版都是英文，所以我们需要将它重写一下。

### children

可以理解为文档的API部分。

### this.memberof & this.name

API所属对象和API的方法名。

### description

API的描述，其实跟组件的描述是同一个文档，可以理解为设计模式中的Composite(组合模式)。

### params

API的参数列表，我们只要按照文档规范，细调一下顺序即可。