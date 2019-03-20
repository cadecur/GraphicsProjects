
var gl;
var points;

var interior = true;


var vertex1,vertex2,vertex3;

var vert1color;
var vert2color;
var vert3color;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var default1 = vec3(1,0,0);
    var default2 = vec3(0,1,0);
    var default3 = vec3(0,0,1);
    var vertex1 = default1, vertex2 = default2, vertex3 = default3;
    
    var vertices = [vec2(0,1), vec2(1,-1), vec2(-1,-1)];
    var rgb = [vertex1, vertex2, vertex3];

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    

    // add menu suport
    var mymenu = document.getElementById("Selection Menu");
    mymenu.onclick = function(event) {
        switch (event.target.index) {
        case 0:
            //case when interpolated, reset to default colors (RGB)
            vertex1 = default1;
            vertex2 = default2;
            vertex3 = default3;
            rgb = [vertex1,vertex2,vertex3];
            gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
            gl.bufferData (gl.ARRAY_BUFFER, flatten(rgb), gl.DYNAMIC_DRAW );
            break;
        case 1:
            //case when flat, set all vals to current vert1color
            vertex2 = vertex1;
            vertex3 = vertex1;
            rgb = [vert1Color,vert1Color,vert1Color];
            gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
            gl.bufferData (gl.ARRAY_BUFFER, flatten(rgb), gl.DYNAMIC_DRAW );
            break;
        case 2:
            //toggle boundary
            interior = false;
            break;
        case 3:
            //toggle interior
            interior = true;
        }
    };

    //Initialize colorpickers & vert color
    var input1 = document.getElementById("vert1");
    var vert1Color = vec3(1,0,0);
    var input2 = document.getElementById("vert2");
    var vert2Color = vec3(0,1,0);
    var input3 = document.getElementById("vert3");
    var vert3Color = vec3(0,0,1);

    //colorpickers (interactive)
    input1.addEventListener("input", function() {
        vert1Color = mapRGB(hex_to_RGB(input1.value));
        rgb = [vert1Color,vert2Color,vert3Color];
        gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
        gl.bufferData (gl.ARRAY_BUFFER, flatten(rgb), gl.DYNAMIC_DRAW );
     }, false);
    

    input2.addEventListener("input", function() {
        vert2Color = mapRGB(hex_to_RGB(input2.value));
        rgb = [vert1Color,vert2Color,vert3Color];
        gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
        gl.bufferData (gl.ARRAY_BUFFER, flatten(rgb), gl.DYNAMIC_DRAW );
     }, false);
    
    input3.addEventListener("input", function() {
        vert3Color = mapRGB(hex_to_RGB(input3.value));
        rgb = [vert1Color,vert2Color,vert3Color];
        gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
        gl.bufferData (gl.ARRAY_BUFFER, flatten(rgb), gl.DYNAMIC_DRAW );
     }, false);

    //----------------------------------------------------------------------------------
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Associate shader w/ color
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
    gl.bufferData (gl.ARRAY_BUFFER, flatten(rgb), gl.DYNAMIC_DRAW );


    var vColor = gl.getAttribLocation( program, 'vColor' );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    render();
};



function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    //draws interior, unless boundary is specified
    if (interior){
        gl.drawArrays( gl.TRIANGLES, 0, 3 );
    }
    else{
        gl.drawArrays( gl.LINE_LOOP, 0, 3 );
    }

    requestAnimationFrame(render);
}

// Credit: David (user:1047797) on StackOverFlow
function hex_to_RGB(hex) {
    var m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
    return vec3(parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16));
}
// -----------------------------

//maps rgb vals to webgl vals (0-1 rather than 0-255)
//my function :)
function mapRGB(rgb){
    temp0 = map_point(0,255,0,1,rgb[0]);
    temp1 = map_point(0,255,0,1,rgb[1]);
    temp2 = map_point(0,255,0,1,rgb[2]);
    rgb[0] = temp0;
    rgb[1] = temp1;
    rgb[2] = temp2;
    return rgb;
}
