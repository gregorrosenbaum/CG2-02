
/* requireJS module definition */
define(["util", "vbo", "models/cube", "models/triangle", "models/band", "scene_node", "gl-matrix", "program", "shaders"], 
       (function(Util, vbo, Cube, Triangle, Band, SceneNode, glmatrix, Program, shaders) {
       
    "use strict";
    
    // constructor, takes WebGL context object as argument
    var Robot = function(gl, programs, config) {


      //Components to build Robot
      var cube          = new Cube(gl);
      var triangle      = new Triangle(gl);
      var band          = new Band(gl, {radius: 0.5, height: 1.0, segments: 50, asWireframe:true});
      var band2         = new Band(gl, {radius: 0.5, height: 1.0, segments: 50});
      //new Band(gl, {radius: 0.5, height: 1.0, segments: 50});

      // Dimension of the shapes to be drawn
      var torsoSize     = [0.6, 1.0, 0.4];
      var headSize      = [torsoSize[0]/2, torsoSize[1]*0.4, torsoSize[2]*0.75];
      var hatSize	    = [torsoSize[2],   torsoSize[2],     torsoSize[0]];
      var neckSize      = [torsoSize[2]/2, torsoSize[2]/2,   torsoSize[2]/2];
      var shoulderSize  = [torsoSize[0]/3, torsoSize[1]/10,  torsoSize[2]/2];
      var upperArmSize  = [torsoSize[0]*4, torsoSize[1]*0.75,torsoSize[2]*2];
      var foreArmSize   = [torsoSize[0]*2, torsoSize[1]*0.75,torsoSize[2]*2];
      var ellbowSize    = [torsoSize[0],   torsoSize[1]*1.5, torsoSize[2]*2];
      var wristSize     = [torsoSize[0]*3, torsoSize[1]/10,  torsoSize[2]*3];
      var handSize      = [torsoSize[1],   torsoSize[1],     torsoSize[1]];

      // Positions of body parts
      var torsoPosition             = [0, 0, 0];
      var hatPosition				        = [torsoPosition[0], torsoPosition[1]+0.2,   torsoPosition[2]];
      var headPosition              = [torsoPosition[0], torsoPosition[1]+0.75,  torsoPosition[2]];
      var neckPosition              = [torsoPosition[0], torsoPosition[1], torsoPosition[2]];
      
      var shoulderRightPosition     = [0.35, 0.4, 0];
      var upperArmRightPosition     = [-1.5, 0.25, 0.15];
      var ellbowRightPosition       = [-0.5, -0.3, 0.0];
      var foreArmRightPosition      = [-0.7, 0.2, 0.0];
	  var wristRightPosition        = [-0.5, 0.0, 0];
      var handRightPosition         = [0.0, -0.75, 0];
	  
	  
	  var shoulderLeftPosition     = [-0.35, 0.4, 0];
      var upperArmLeftPosition     = [-1.5, -0.25, 0.15];
      var ellbowLeftPosition       = [-0.5, -0.3, 0.0];
      var foreArmLeftPosition      = [-0.7, 0.2, 0];
	  var wristLeftPosition        = [-0.5, 0.0, 0];
      var handLeftPosition         = [ 0.0, -1.0, 0];
	
      //Sceleton for torso and head
      this.hat		   = new SceneNode("hat");
      mat4.translate(this.hat.transformation, hatPosition);
      
      this.head         = new SceneNode("head", [this.hat]);
      mat4.translate(this.head.transformation, headPosition);
      
      this.neck         = new SceneNode("neck", [this.head]);
      mat4.translate(this.neck.transformation, neckPosition);

	  this.torso        = new SceneNode("torso");
	  mat4.translate(this.torso.transformation, torsoPosition);
	  
	
	  
      //Right side
      this.handRight    = new SceneNode("handRight");
      mat4.translate(this.handRight.transformation, handRightPosition);
      mat4.scale    (this.handRight.transformation, handSize);    

      this.wristRight   = new SceneNode("wristRight", [this.handRight]);
      mat4.translate(this.wristRight.transformation, wristRightPosition);
      mat4.rotate   (this.wristRight.transformation, Math.PI,[1,1,0]);
      mat4.scale    (this.wristRight.transformation, wristSize);

      this.foreArmRight = new SceneNode("foreArmRight", [this.wristRight]);
      mat4.translate(this.foreArmRight.transformation, foreArmRightPosition);
      mat4.scale    (this.foreArmRight.transformation, foreArmSize);


      this.ellbowRight  = new SceneNode("ellbowRight", [this.foreArmRight]);
      mat4.translate(this.ellbowRight.transformation, ellbowRightPosition);
      // mat4.rotate   (ellbowRight.transformation, Math.PI,[1,1,0]);
      mat4.scale    (this.ellbowRight.transformation, ellbowSize);

      this.upperArmRight= new SceneNode("upperArmRight", [this.ellbowRight]);
      mat4.translate(this.upperArmRight.transformation, upperArmRightPosition);
      mat4.scale    (this.upperArmRight.transformation, upperArmSize);

      this.shoulderRight= new SceneNode("shoulderRight", [this.upperArmRight]);
      mat4.translate(this.shoulderRight.transformation, shoulderRightPosition);
      mat4.rotate   (this.shoulderRight.transformation, Math.PI,[1,1,0]);
      mat4.scale    (this.shoulderRight.transformation, shoulderSize);
      


      //Left side
      
      this.handLeft = new SceneNode("handLeft");
      mat4.translate(this.handLeft.transformation, handLeftPosition);
      mat4.scale    (this.handLeft.transformation, handSize); 
          

      this.wristLeft   = new SceneNode("wristLeft", [this.handLeft]);
      mat4.translate(this.wristLeft.transformation, wristLeftPosition);
      mat4.rotate   (this.wristLeft.transformation,   Math.PI,[1,1,0]);
      mat4.scale    (this.wristLeft.transformation, wristSize);

      this.foreArmLeft = new SceneNode("foreArmLeft", [this.wristLeft]);
      mat4.translate(this.foreArmLeft.transformation, foreArmLeftPosition);
      mat4.scale    (this.foreArmLeft.transformation, foreArmSize);

      this.ellbowLeft  = new SceneNode("ellbowLeft", [this.foreArmLeft]);
      mat4.translate(this.ellbowLeft.transformation, ellbowLeftPosition);
      //mat4.rotate   (ellbowLeft.transformation, Math.PI,[1,1,0]);
      mat4.scale    (this.ellbowLeft.transformation, ellbowSize);

      this.upperArmLeft= new SceneNode("upperArmLeft", [this.ellbowLeft]);
      mat4.translate(this.upperArmLeft.transformation, upperArmLeftPosition);
      mat4.scale    (this.upperArmLeft.transformation, upperArmSize);

      this.shoulderLeft= new SceneNode("shoulderLeft", [this.upperArmLeft]);
      mat4.translate(this.shoulderLeft.transformation, shoulderLeftPosition);
      mat4.rotate   (this.shoulderLeft.transformation, Math.PI,[1,1,0]);
      mat4.scale    (this.shoulderLeft.transformation, shoulderSize);

      //add object 
      
                             
      this.torso.addObjects([this.neck, this.shoulderRight, this.shoulderLeft]);
      //, shoulderRight]);
	  mat4.translate(this.torso.transformation, torsoPosition);
	  
      //Skins - Right
      var torsoSkin     = new SceneNode ("torso skin", [cube], programs.vertexColor);
      mat4.scale(torsoSkin.transformation, torsoSize);
      
      var hatSkin		= new SceneNode ("hat skin", [triangle], programs.vertexColor);
      mat4.rotate(hatSkin.transformation, 0.6*Math.PI, [0,1,0]);
      mat4.scale(hatSkin.transformation, hatSize);

      var headSkin      = new SceneNode ("head skin", [cube], programs.vertexColor);
      mat4.rotate(headSkin.transformation, 0.6*Math.PI, [0,1,0])// color
      mat4.scale(headSkin.transformation, headSize);

      var neckSkin      = new SceneNode ("neck skin", [band], programs.red);
      mat4.translate(neckSkin.transformation, [0,0.55,0]);
      mat4.scale(neckSkin.transformation, neckSize);

      var shoulderSkin  = new SceneNode ("shoulder skin", [band2], programs.black);

      var upperArmSkin  = new SceneNode ("upperArm skin", [cube], programs.vertexColor);

      var ellbowSkin    = new SceneNode ("ellbow skin", [band], programs.black);
      mat4.translate(ellbowSkin.transformation, [0,0.2,0]);
      mat4.scale(ellbowSkin.transformation, ellbowSize);

      var foreArmSkin  = new SceneNode ("foreArm skin", [cube], programs.vertexColor);


      var wristSkin     = new SceneNode ("wrist skin", [band], programs.black);
      // mat4.translate(ellbowSkin.transformation, [0,0.2,0]);
      // mat4.scale(wristSkin.transformation, wristSize);

      var handSkin      = new SceneNode ("hand skin", [triangle], programs.vertexColor);
      mat4.rotate(handSkin.transformation, Math.PI, [1,0,1]);
      
      //Connect sceleton and skins
      this.torso.addObjects([torsoSkin]);
      this.hat.addObjects([hatSkin]);
      this.head.addObjects([headSkin]);
      this.neck.addObjects([neckSkin]);

      this.shoulderRight.addObjects([shoulderSkin]);
      this.shoulderLeft.addObjects([shoulderSkin]);
      this.upperArmRight.addObjects([upperArmSkin]);
      this.upperArmLeft.addObjects([upperArmSkin]);
      this.ellbowRight.addObjects([ellbowSkin]);
      this.ellbowLeft.addObjects([ellbowSkin]);
      this.foreArmRight.addObjects([foreArmSkin]);
      this.foreArmLeft.addObjects([foreArmSkin]);
      this.wristRight.addObjects([wristSkin]);
      this.wristLeft.addObjects([wristSkin]);
      this.handRight.addObjects([handSkin]);
      this.handLeft.addObjects([handSkin]);

      //the robot
      var robot = new SceneNode ("robot", [this.torso]);

      mat4.translate(robot.transformation, [0,-0.2,0]);
      
      this.world = new SceneNode("world", [robot], programs.vertexColor);
      
      
      // for the UI - this will be accessed directly by HtmlController
      this.drawOptions = {"Perspective": true};
      
               
    
    };

    // draw method: activate buffers and issue WebGL draw() method
    Robot.prototype.draw = function(gl, program, transformation) {

    this.world.draw (gl, program, transformation);

    };
    
    
   
    Robot.prototype.rotate = function(robotParts, angle) {
    	
    	
        window.console.log("Robot: rotating around " + robotParts + " by " + angle + " degrees." );
		
        // degrees to radians
        //angle = angle*Math.PI/180;
        
        // manipulate the corresponding matrix, depending on the name of the joint
        switch(robotParts) {
			
            case "rotateNeck":
            	mat4.rotate(this.neck.transformation, angle, [0,1,0]);
            	break;
            case "rotateShoulderLeft":
            	mat4.rotate(this.shoulderLeft.transformation, angle, [0,1,0]);
             	break;
          
            case "rotateShoulderRight":
            	mat4.rotate(this.shoulderRight.transformation, angle, [0,1,0]);
            	break;
            	
            case "rotateEllbowLeft":
            	mat4.rotate(this.ellbowLeft.transformation, angle, [0,1,0]);
            	break; 
            	
            case "rotateEllbowRight":
            	mat4.rotate(this.ellbowRight.transformation, angle, [0,1,0]);
            	break;  
            	
           case "rotateWristLeft":
            	mat4.rotate(this.wristLeft.transformation, angle, [0,1,0]);
            	break;  
           case "rotateWristRight":
            	mat4.rotate(this.wristRight.transformation, angle, [0,1,0]);
            	break; 

              
            default:
                window.console.log("axis " + robotParts + " not implemented.");
            break;
        };
    }
	
    return Robot;

})); // define

    
