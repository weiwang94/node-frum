## 过程梳理

### 1， 启动服务

使用 net 模块创建一个服务，开启监听，处理数据发送响应，处理错误，关闭服务。
    
    const net = require('net')
    const server = net.server()
    // 监听
    server.listen(() => {
        
    })
    // 处理数据
    server.on('conection', (s) => {
        s.on('data', (r) => {
        
            // 发送响应后 销毁 socket
            s.destroy()
        })
       
    })  
    server.on('error', (error) => {
            
    })
    server.on('colse', (error) => {
                        
    })
    
### 2， 处理响应

1) 根据响应格式，解析出响应方法（GET POST PUT DELETE）,路径（/xxx）和参数（{xxx：xxxx}）

2) 把解析出的请求封装成一个对象，传给路由，路由根据请求给出响应

### 3， 路由

1) 响应的格式一般为
    
    HTTP/1.1 200 OK
    Content-Type: text/html

    网页 html 数据
    
2) 用 model 处理数据，用数据替换 html 页面中的文本。

### 4， model

1） 写一个基类，用于读取和保存数据。

2） 写继承自基类的具体业务类。

  