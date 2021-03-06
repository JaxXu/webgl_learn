const element = document.querySelector('#canvas');
// 有些浏览器需要兼容前缀
const context = element.getContext('webgl') || element.getContext('experimental-webgl');


// 顶点着色器
const vertexShaderSource = `
    precision mediump float;
    attribute vec2 a_Position;
    attribute vec2 a_Screen_Size;
    
    // 顶点颜色
    attribute vec4 a_Color;
    // 传往片元着色器的颜色
    varying vec4 v_Color;
    
    void main(){
        // 将屏幕坐标系转化为裁剪坐标（裁剪坐标系）
        vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
        position = position * vec2(1.0, -1.0);
        gl_Position = vec4(position, 0, 1);
        v_Color = a_Color;
    }
`;
const vertexShader = context.createShader(context.VERTEX_SHADER);
context.shaderSource(vertexShader, vertexShaderSource);
context.compileShader(vertexShader);


// 片元着色器
const fragmentShaderSource = `
    precision mediump float;
    varying vec4 v_Color;
    void main(){
       vec4 color = v_Color / vec4(255, 255, 255, 1);
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


// // =========================== 多 Buffer ============================
// const pointsBuffer = context.createBuffer();
// context.bindBuffer(context.ARRAY_BUFFER, pointsBuffer);
// const a_Position = context.getAttribLocation(program, 'a_Position');
// context.enableVertexAttribArray(a_Position);
// context.vertexAttribPointer(a_Position, 2, context.FLOAT, false, 0, 0);
//
// const colorsBuffer = context.createBuffer();
// context.bindBuffer(context.ARRAY_BUFFER, colorsBuffer);
// const a_Color = context.getAttribLocation(program, 'a_Color');
// context.enableVertexAttribArray(a_Color);
// context.vertexAttribPointer(a_Color, 4, context.FLOAT, false, 0, 0);
// // =========================== 多 Buffer ============================


// =========================== 单 Buffer ============================
const buffer = context.createBuffer();
context.bindBuffer(context.ARRAY_BUFFER, buffer);

const a_Position = context.getAttribLocation(program, 'a_Position');
context.enableVertexAttribArray(a_Position);
context.vertexAttribPointer(a_Position, 2, context.FLOAT, false, 24, 0);

const a_Color = context.getAttribLocation(program, 'a_Color');
context.enableVertexAttribArray(a_Color);
context.vertexAttribPointer(a_Color, 4, context.FLOAT, false, 24, 8); // todo stride 表示单个顶点信息所占用的字节数 , offset 偏移字节数

// =========================== 单 Buffer ============================

// 转换到 NDC 坐标
const a_Screen_Size = context.getAttribLocation(program, 'a_Screen_Size');
context.vertexAttrib2f(a_Screen_Size, element.width, element.height);


const positions = [];
const colors = [];
element.addEventListener('mouseup', evt => {
    const pageX = evt.pageX;
    const pageY = evt.pageY;

    // // =========================== 多 Buffer ============================
    // positions.push(
    //     pageX, pageY,
    // );
    // colors.push(
    //     Math.ceil(Math.random() * 255),
    //     Math.ceil(Math.random() * 255),
    //     Math.ceil(Math.random() * 255),
    //     1
    // );
    //
    // if(positions.length % 18 === 0) {
    //
    //     context.bindBuffer(context.ARRAY_BUFFER, pointsBuffer);
    //     context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.DYNAMIC_DRAW);
    //
    //     context.bindBuffer(context.ARRAY_BUFFER, colorsBuffer);
    //     context.bufferData(context.ARRAY_BUFFER, new Float32Array(colors), context.DYNAMIC_DRAW);
    //
    //     // 清除画布
    //     context.clearColor(0.0, 0.0, 0.0, 1.0);
    //     context.clear(context.COLOR_BUFFER_BIT);
    //
    //     if (positions.length % 6 === 0) {
    //         context.drawArrays(context.TRIANGLES, 0, positions.length / 2);
    //     }
    // }
    // // =========================== 多 Buffer ============================

    // =========================== 单 Buffer ============================
    positions.push(
        // 顶点坐标
        pageX,
        pageY,

        // 颜色信息
        Math.ceil(Math.random() * 255),
        Math.ceil(Math.random() * 255),
        Math.ceil(Math.random() * 255),
        1
    );
    if (positions.length % 18 === 0) {
        // 清除画布
        context.clearColor(0.0, 0.0, 0.0, 1.0);
        context.clear(context.COLOR_BUFFER_BIT);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW);
        context.drawArrays(context.TRIANGLES, 0, positions.length / 6);
    }
    // =========================== 单 Buffer ============================
})
