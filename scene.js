/*
  *
 * Module scene: Computergrafik 2, Aufgabe 2
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */


/* requireJS module definition */
define(["jquery", "gl-matrix", "util", "program", "shaders", 
        "models/triangle", "models/cube",  "models/band", "models/robot"], 
       (function($, glmatrix, util, Program, shaders,
                 Triangle, Cube, Band, Robot) {

    "use strict";
    
    // simple scene: create some scene objects in the constructor, and
    // draw them in the draw() method
    var Scene = function(gl) {

        // store the WebGL rendering context 
        this.gl = gl;  
            
        // create all required GPU programs from vertex and fragment shaders
        this.programs = {};
        this.programs.vertexColor = new Program(gl, 
                                                shaders.vs_PerVertexColor(), 
                                                shaders.fs_PerVertexColor() );   
        this.programs.red = new Program(gl, 
                                        shaders.vs_NoColor(), 
                                        shaders.fs_ConstantColor([1.0,0.0,0.0,1.0]) );
                                        
        this.programs.black = new Program(gl, 
                                        shaders.vs_NoColor(), 
                                        shaders.fs_ConstantColor([0.0,0.0,0.0,1.0]) );
        
        // initial position of the camera
        this.cameraTransformation = mat4.lookAt([0,0.5,3], [0,0,0], [0,1,0]);

        // transformation of the scene, to be changed by animation
        this.transformation = mat4.create(this.cameraTransformation);


        // create some objects to be used for drawing
        this.triangle = new Triangle(gl);
        this.cube = new Cube(gl);
        this.band = new Band(gl);
        this.band2 = new Band(gl,{asWireframe:true});
        this.robot = new Robot(gl, this.programs, this.transformation);

        
        // the scene has an attribute "drawOptions" that is used by 
        // the HtmlController. Each attribute in this.drawOptions 
        // automatically generates a corresponding checkbox in the UI.
        this.drawOptions = { "Perspective Projection": false, 
                             "Show Triangle": false,
                             "Show Cube": false,
                             "Show Band": false,
                             "Wireframe":false,
                             "Depth":true,
                             "Cull Face": false,
                             "Back": false,
                             "Front": false,
                             "Show Robot":true,
                         };                       
    };

    // the scene's draw method draws whatever the scene wants to draw
    Scene.prototype.draw = function() {
        
        // just a shortcut
        var gl = this.gl;

        // set up the projection matrix, depending on the canvas size
        var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        var projection = this.drawOptions["Perspective Projection"] ?
                             mat4.perspective(45, aspectRatio, 0.01, 100) : 
                             mat4.ortho(-aspectRatio, aspectRatio, -1,1, 0.01, 100);


        // set the uniform variables for all used programs
        for(var p in this.programs) {
            this.programs[p].use();
            this.programs[p].setUniform("projectionMatrix", "mat4", projection);
            this.programs[p].setUniform("modelViewMatrix", "mat4", this.transformation);
        }
        
        // clear color and depth buffers
        gl.clearColor(0.7, 0.7, 0.7, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
            
        // set up depth test to discard occluded fragments
        if(this.drawOptions["Depth"]) {
			gl.enable(gl.DEPTH_TEST);
        }else{
			gl.disable(gl.DEPTH_TEST);
	    };
	    
	    
	    if(this.drawOptions["Cull Face"]) {
			gl.enable(gl.CULL_FACE);
			gl.cullFace(gl.FRONT_AND_BACK);
		}else{	
			gl.disable(gl.CULL_FACE);
			gl.cullFace(gl.FRONT_AND_BACK);
	    };
	    
	    if(this.drawOptions["Front"]) {
	    	gl.enable(gl.CULL_FACE);
	    	gl.cullFace(gl.FRONT);
	    };
	    
	    
	    if(this.drawOptions["Back"]) {
	    	gl.enable(gl.CULL_FACE);
	    	gl.cullFace(gl.BACK);
	    };
	   
	   
	 
       
       
        // draw the scene objects
        if(this.drawOptions["Show Triangle"]) {    
           this.triangle.draw(gl, this.programs.vertexColor);
        }

        if(this.drawOptions["Show Cube"]) {
            this.cube.draw(gl, this.programs.vertexColor);
        }
        if(this.drawOptions["Show Band"]) {
            this.band.draw(gl, this.programs.red);
        }
        
        if(this.drawOptions["Wireframe"]) {
            this.band2.draw(gl, this.programs.black);
        }
        if(this.drawOptions["Show Robot"]) {
            this.robot.draw(gl, this.programs.vertexColor, this.transformation);
        }
       
       

    };

    // the scene's rotate method is called from HtmlController, when certain
    // keyboard keys are pressed. Try Y and Shift-Y, for example.
    Scene.prototype.rotate = function(rotationAxis, angle) {

        window.console.log("Scene: rotating around " + rotationAxis + " by " + angle + " degrees." );

        // degrees to radians
        angle = angle*Math.PI/180;
        
        // manipulate the corresponding matrix, depending on the name of the joint
        switch(rotationAxis) {

            case "worldX": 
                mat4.rotate(this.transformation, angle, [1,0,0]);
                break;
                
            case "worldY": 
                mat4.rotate(this.transformation, angle, [0,1,0]);
                break;    
            default:
            	this.robot.rotate(rotationAxis, angle);    
                window.console.log("axis " + rotationAxis + " not implemented.");
            break;
            
        };
        

        // redraw the scene
        this.draw();
    }

    return Scene;            
    
})); // define module
        

