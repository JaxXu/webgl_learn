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

// // ======================= 圆形 =======================
// function createCircleVertex(x, y, radius, n) {
//     const positions = [x, y, 255, 0, 0, 1];
//     for(let i = 0; i <= n; i++) {
//         const angle = i * Math.PI * 2 / n;
//         positions.push(
//             x + radius * Math.sin(angle),
//             y + radius * Math.cos(angle),
//             255, 0, 0, 1
//         );
//     }
//     return positions;
// }
// const positions = createCircleVertex(100, 100, 50, 50);
//
// context.clearColor(0.0, 0.0, 0.0, 1.0);
// context.clear(context.COLOR_BUFFER_BIT);
// context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.DYNAMIC_DRAW);
// context.drawArrays(context.TRIANGLE_FAN, 0, positions.length / 6);
// // ======================= 圆形 =======================



// ======================= 圆环 =======================
function createRingVertex(x, y, innerRadius, outerRadius, n) {
    const positions = [];
    let color = {
        r: 128,
        g: 128,
        b: 128,
        a: 1.0
    };
    for (let i = 0; i <= n; i++) {
        if (i % 2 === 0) {
            color = {
                r: i % 255,
                g: i % 255,
                b: i % 255,
                a: 1.0
            };
        }
        const angle = i * Math.PI * 2 / n;
        positions.push(x + innerRadius * Math.sin(angle), y + innerRadius * Math.cos(angle), color.r, color.g, color.b, color.a);
        positions.push(x + outerRadius * Math.sin(angle), y + outerRadius * Math.cos(angle), color.r, color.g, color.b, color.a);
    }
    const indices = [];
    for (let i = 0; i < n; i++) {
        const p0 = i * 2;
        const p1 = i * 2 + 1;
        let p2 = (i + 1) * 2 + 1;
        let p3 = (i + 1) * 2;
        if (i === n - 1) {
            p2 = 1;
            p3 = 0;
        }
        indices.push(p0, p1, p2, p2, p3, p0);
    }
    return {
        positions: positions,
        indices: indices
    };
}
const { positions, indices } = createRingVertex(100, 100, 20, 50, 100);
context.clearColor(0.0, 0.0, 0.0, 1.0);
context.clear(context.COLOR_BUFFER_BIT);
context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.DYNAMIC_DRAW);

const indicesBuffer = context.createBuffer();
context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indicesBuffer);
context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), context.STATIC_DRAW);
context.drawElements(context.TRIANGLES, indices.length, context.UNSIGNED_SHORT, 0);
// ======================= 圆环 =======================

