const element = document.querySelector('#canvas');
// 有些浏览器需要兼容前缀
const context = element.getContext('webgl') || element.getContext('experimental-webgl');


// 顶点着色器
const vertexShaderSource = `
    // 设置浮点数精度为中等精度
    precision mediump float;
    // 接收点在 canvas 坐标系上的坐标 (x, y)
    attribute vec2 a_Position;
    // 接收 canvas 的宽高尺寸
    attribute vec2 a_Screen_Size;
    void main(){
       // start 将屏幕坐标系转化为裁剪坐标（裁剪坐标系）
       vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0; 
       position = position * vec2(1.0, -1.0);
       gl_Position = vec4(position, 0, 1);
       // end 将屏幕坐标系转化为裁剪坐标（裁剪坐标系）
       // 声明要绘制的点的大小。
       gl_PointSize = 10.0;
    }
`;
const vertexShader = context.createShader(context.VERTEX_SHADER);
context.shaderSource(vertexShader, vertexShaderSource);
context.compileShader(vertexShader);


// 片元着色器
const fragmentShaderSource = `
    // 设置浮点数精度为中等精度
    precision mediump float;
    // 接收 JavaScript 传过来的颜色值（RGBA）。
    uniform vec4 u_Color;
    void main(){
       // 将普通的颜色表示转化为 WebGL 需要的表示方式，即将【0-255】转化到【0,1】之间。
       vec4 color = u_Color / vec4(255, 255, 255, 1);
       gl_FragColor = color; 
    }
`;
const fragmentShader = context.createShader(context.FRAGMENT_SHADER);
context.shaderSource(fragmentShader, fragmentShaderSource);
context.compileShader(fragmentShader);


// 着色器程序
const program = context.createProgram();
context.attachShader(program, vertexShader);
context.attachShader(program, fragmentShader);
context.linkProgram(program);


// 选择创建的着色器程序
context.useProgram(program);



// 获取变量
const a_Position = context.getAttribLocation(program, 'a_Position');
const a_Screen_Size = context.getAttribLocation(program, 'a_Screen_Size');
const u_Color = context.getUniformLocation(program, 'u_Color');

context.vertexAttrib2f(a_Screen_Size, element.width, element.height);

const points = [];
element.addEventListener('click', (e) => {
    const pageX = e.pageX;
    const pageY = e.pageY;

    const color = {
        r: 128,
        g: 128,
        b: 128,
        a: 1.0,
    };

    points.push({
        x: pageX,
        y: pageY,
        color,
    });

    // 设置清除画布颜色
    context.clearColor(0.0, 0.0, 0.0, 1.0);
    context.clear(context.COLOR_BUFFER_BIT);

    points.forEach((point) => {

        context.uniform4f(u_Color, point.color.r, point.color.g, point.color.b, point.color.a);
        context.vertexAttrib2f(a_Position, point.x, point.y);
        context.drawArrays(context.POINTS, 0, 1);
    });
});

// 设置清除画布颜色
context.clearColor(0.0, 0.0, 0.0, 1.0);
context.clear(context.COLOR_BUFFER_BIT);
