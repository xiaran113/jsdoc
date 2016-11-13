/**
  * 书
  * 
  * @author 作者 <邮箱>
  * @version v1.0.0
  * 
  * @example const book = new Book(title, author);
  */
class Book {

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

    /**
     * 获取标题
     * @returns {string}
     */
    getTitle() {
        return this.title;
    }

    /**
     * 获取作者
     * @returns {string}
     */
    getAuthor() {
        return this.author;
    }

    /**
     * 设置书的标题
     * @param {string} title='' - 新标题
     */
    setTitle(title) {
        this.tile = title; // 将标题设置成新的标题
    }

    /**
     * 设置书的作者
     * @param {string} author='' - 新作者
     */
    setAuthor(author) {
        this.author = author; // 将作者设置成新的作者
    }
}
