
var gl;
var recursive_depth = 5;
var points = [];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //initial triangle
    var vertices = [vec2(-1,-1), vec2(0,1), vec2(1,-1)];

    sliceTriangle(vertices[0],vertices[1],vertices[2], recursive_depth);

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    gl.drawArrays( gl.TRIANGLES, 0, points.length);
}

function mix( u, v, s )
{
    if ( typeof s !== "number" ) {
        throw "mix: the last paramter " + s + " must be a number";
    }

    if ( u.length != v.length ) {
        throw "vector dimension mismatch";
    }

    var result = [];
    for ( var i = 0; i < u.length; ++i ) {
        result.push( (1.0 - s) * u[i] + s * v[i] );
    }

    return result;
}


function sliceTriangle(a, b, c, depth){
    if (depth === 0){
        points.push(a,b,c);
    }

    else{
        //calculate points
        var pointAB = mix(a,b, 0.5);
        var pointBC = mix(b,c, 0.5);
        var pointAC = mix(c,a, 0.5);

        //decrement count
        --depth;

        //recursive call
        sliceTriangle(a, pointAB, pointAC, depth);
        sliceTriangle(b, pointAB, pointBC, depth);
        sliceTriangle(c, pointAC, pointBC, depth);
    }
}