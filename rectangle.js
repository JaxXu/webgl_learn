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


const buffer = context.createBuffer();
context.bindBuffer(context.ARRAY_BUFFER, buffer);

const a_Position = context.getAttribLocation(program, 'a_Position');
context.enableVertexAttribArray(a_Position);
context.vertexAttribPointer(a_Position, 2, context.FLOAT, false, 24, 0);

const a_Color = context.getAttribLocation(program, 'a_Color');
context.enableVertexAttribArray(a_Color);
context.vertexAttribPointer(a_Color, 4, context.FLOAT, false, 24, 8); // todo stride 表示单个顶点信息所占用的字节数 , offset 偏移字节数

// 转换到 NDC 坐标
const a_Screen_Size = context.getAttribLocation(program, 'a_Screen_Size');
context.vertexAttrib2f(a_Screen_Size, element.width, element.height);


// // ======================= 普通三角绘制 =======================
// //
// // const positions = [
// //     30, 30, 255, 0, 0, 1,    //V0
// //     30, 300, 255, 0, 0, 1,   //V1
// //     300, 300, 255, 0, 0, 1,  //V2
// //     30, 30, 0, 255, 0, 1,    //V0
// //     300, 300, 0, 255, 0, 1,  //V2
// //     300, 30, 0, 255, 0, 1    //V3
// // ];
// //
// // // 清除画布
// // context.clearColor(0.0, 0.0, 0.0, 1.0);
// // context.clear(context.COLOR_BUFFER_BIT);
// // context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW);
// // context.drawArrays(context.TRIANGLES, 0, positions.length / 6);
//
// const positions = [
//     30, 30, 255, 0, 0, 1,    //V0
//     30, 300, 255, 0, 0, 1,   //V1
//     300, 300, 255, 0, 0, 1,  //V2
//     300, 30, 0, 255, 0, 1    //V3
// ];
// const indices = [
//     0, 1, 2,
//     0, 2, 3,
// ]
//
// const indicesBuffer = context.createBuffer();
// context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indicesBuffer);
// context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), context.STATIC_DRAW);
//
// // 清除画布
// context.clearColor(0.0, 0.0, 0.0, 1.0);
// context.clear(context.COLOR_BUFFER_BIT);
// context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW);
// context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0);
// // ======================= 普通三角绘制 =======================

// // ======================= 三角带绘制 =======================
// const positions = [
//     30, 300, 255, 0, 0, 1,   //V0
//     300, 300, 255, 0, 0, 1,  //V1
//     30, 30, 255, 0, 0, 1,    //V2
//     300, 30, 0, 255, 0, 1    //V3
// ];
// context.clearColor(0.0, 0.0, 0.0, 1.0);
// context.clear(context.COLOR_BUFFER_BIT);
// context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW);
// context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
// // ======================= 三角带绘制 =======================

// ======================= 三角扇绘制 =======================
const positions = [
    165, 165, 255, 255, 0, 1,//V0
    30, 30, 255, 0, 0, 1,    //V1
    30, 300, 255, 0, 0, 1,   //V2
    300, 300, 255, 0, 0, 1,  //V3
    300, 30, 0, 255, 0, 1,   //V4
    30, 30, 255, 0, 0, 1,    //V5
];
context.clearColor(0.0, 0.0, 0.0, 1.0);
context.clear(context.COLOR_BUFFER_BIT);
context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW);
context.drawArrays(context.TRIANGLE_FAN, 0, 6);
// ======================= 三角带绘制 =======================
