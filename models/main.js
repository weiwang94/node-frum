const fs = require('fs')

const ensureExists = (path) => {
    if (!fs.existsSync(path)) {
        const data = '[]'
        fs.writeFileSync(path, data)
    }
}

// 保存文件
const save = (data, path) => {
    const s = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, s)
}

// 读取文件
const load = (path) => {
    const options = {
        encoding: 'utf8',
    }
    ensureExists(path)
    const s = fs.readFileSync(path, options)
    const data = JSON.parse(s)
    return data
}

class Model {
    // 返回 文件名
    static dbPath() {
        const classname = this.name.toLowerCase()
        const path = require('path')
        const filename = `${classname}.txt`
        const p = path.join(__dirname, '../db', filename)
        return p
    }

    // 返回
    static _newFromDict(dict) {
        const cls = this
        // 下面这种初始化 model 的方式有 bug, 这种方式会用 form 直接重置数据库现有的内容
        // 比如 dict 里 role 为 1, 但是 constructor 里面 this.role = 2, 这样就会被覆盖
        // 所以先用一个空 object 初始化一个 model 实例, 然后动态改变值
        const m = new cls({})
        Object.keys(dict).forEach((k) => {
            m[k] = dict[k]
        })
        return m
    }

    // 返回 所有数据
    static all() {
        const path = this.dbPath()
        const models = load(path)
        const ms = models.map((m) => {
            const cls = this
            // 之前的写法是
            // const instance = cls.create(m)
            // 这样的话会出现递归调用的情况
            // 因为 create 里会调用 save 方法, save 方法里又会调用 all 方法
            // 即 all -> create -> save -> all
            // 为了避免这种情况, 用一个新方法来生成实例
            const instance = cls._newFromDict(m)
            return instance
        })
        return ms
    }

    // 新加一条数据 并保存到数据库
    static create(form={}, kwargs={}) {
        const cls = this
        const instance = new cls(form)
        // 额外地设置 instance 的属性
        Object.keys(kwargs).forEach((k) => {
            instance[k] = kwargs[k]
        })
        instance.save()
        return instance
    }

    // 返回 符合的
    static findOne(key, value) {
        const all = this.all()
        // 数组的 find 方法，返回第一个符合的元素 或 undefined
        let m = all.find((e) => {
            return e[key] === value
        })
        if (m === undefined) {
            m = null
        }
        return m
    }

    static find(key, value) {
        const all = this.all()
        const models = all.filter((m) => {
            return m[key] === value
        })
        return models
    }

    static get(id) {
        return this.findOne('id', id)
    }

    save() {
        const cls = this.constructor
        const models = cls.all()
        if (this.id === undefined) {
            if (models.length > 0) {
                const last = models[models.length - 1]
                this.id = last.id + 1
            } else {
                // 0 在 js 中会被处理成 false, 第一个元素的 id 设置为 1, 方便处理
                this.id = 1
            }
            models.push(this)
        } else {
            const index = models.findIndex((e) => {
                return e.id === this.id
            })
            if (index > -1) {
                models[index] = this
            }
        }
        const path = cls.dbPath()
        save(models, path)
    }

    static remove(id) {
        const cls = this
        const models = cls.all()
        const index = models.findIndex((e) => {
            return e.id === id
        })
        if (index > -1) {
            models.splice(index, 1)
        }
        const path = cls.dbPath()
        save(models, path)
        return
    }

    toString() {
        const s = JSON.stringify(this, null, 2)
        return s
    }
}

module.exports = Model
