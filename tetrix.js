var canvas;
var gl;
var recursive_depth = 4;
var points = [];
var colors = [];

var theta = [0.0, 0.0, 0.0];
var x = 0;
var y = 1;
var z = 2;
var axis = x;

var theta_loc;

var indices = [
    4,1,0,//front
    2,3,0, //bottom
    0,1,2, //bottom
    0,3,4, //left
    4,3,2, //back
    2,1,4//right
];

//initial triangle
var vertices = [
    vec3(0,0,-1), //a
    vec3(0,1,1/3), //b
    vec3(-1,-1/2,1/3), //c
    vec3(1,-1/2,1/3) //d
];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    sliceTetrix(vertices[0],vertices[1],vertices[2], vertices[3], recursive_depth);

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var colorbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorbuffer );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer() );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW );

    theta_loc = gl.getUniformLocation(program, "theta");

    //listeners
    document.getElementById("xButton").onclick = function(){
        axis = x;
    }
    document.getElementById("yButton").onclick = function(){
        axis = y;
    }
    document.getElementById("zButton").onclick = function(){
        axis = z;
    }

    render();
};


function render() {
    theta[axis] += 2;

    gl.uniform3fv(theta_loc, flatten(theta));
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.TRIANGLES, 0, points.length);
    gl.drawElements( gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0 );
    requestAnimFrame(render);
}

function triColors(point1,point2,point3,color){
    var colorArray = [
        vec3(1,0,0),
        vec3(0,1,0),
        vec3(0,0,1),
        vec3(0,0,0)
    ];

    colors.push(colorArray[color]);
    points.push(point1);
    colors.push(colorArray[color]);
    points.push(point2);
    colors.push(colorArray[color]);
    points.push(point3);
    
}

function sliceTetrix(a, b, c, d, depth){
    if (depth === 0){
        sliceHelp(a,b,c,d);
    }

    else{
        //calculate points
        var pointAB = mix(a,b, 0.5);
        var pointAC = mix(a,c, 0.5);
        var pointAD = mix(a,d, 0.5);
        var pointBC = mix(b,c,0.5);
        var pointBD = mix(b,d,0.5);
        var pointCD = mix(c,d,0.5);

        //decrement count
        --depth;

        //recursive call

        //front face
        sliceTetrix(a, pointAB, pointAC, pointAD, depth);
        sliceTetrix(pointAB, b, pointBC, pointBD, depth);
        sliceTetrix(pointAC, pointBC, c, pointCD, depth);
        sliceTetrix(pointAD, pointBD, pointCD, d, depth);

    }
}

function sliceHelp(a,b,c,d){
    triColors(a,c,b,3);
    vertices.push(1);
    vertices.push(3);
    vertices.push(2);

    triColors(a,c,d,2);
    vertices.push(1);
    vertices.push(3);
    vertices.push(4);

    triColors(a,b,d,1);
    vertices.push(1);
    vertices.push(2);
    vertices.push(4);

    triColors(b,c,d,0);
    vertices.push(2);
    vertices.push(3);
    vertices.push(4);
}