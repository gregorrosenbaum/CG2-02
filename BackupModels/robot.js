
/* requireJS module definition */
define(["util", "vbo", "models/cube", "models/triangle", "models/band", "scene_node", "gl-matrix"], 
       (function(Util, vbo, Cube, Triangle, Band, SceneNode, glmatrix) {
       
    "use strict";
    
    // constructor, takes WebGL context object as argument
    var Robot = function(gl, programs, config) {

      //Components to build Robot
      var cube          = new Cube(gl);
      var triangle      = new Triangle(gl);
      var band          = new Band(gl, {radius: 0.5, height: 1.0, segments: 50});

      // Dimension of the shapes to be drawn
      var headSize      = [0.3, 0.35, 0.3];
      var neckSize      = [];
      var torsoSize     = [0.6, 1.0, 0.4];
      var shoulderSize  = [0.15, 0.1, 0.15];
      var upperArmSize  = [0.1,0.3,0.1];
      var foreArmSize   = [0.1,0.3,0.1];
      var ellbowSize    = [0.15,0.1,0.15];
      var wristSize     = [0.09,0.05,0.09];

      //Sceleton for torso and head
      this.head         = new SceneNode("head");
      mat4.translate(this.head.transformation, [0, torsoSize[1]/2+headSize[1]/2, 0]);
      
      this.neck         = new SceneNode("neck", [this.head]);
      mat4.translate(this.neck.transformation, [0, torsoSize[1]/2+headSize[1]/2, 0]);

      this.torso        = new SceneNode("torso", [this.neck]); //head is child of torso

      
      //Right side
      this.shoulderRight= new SceneNode("shoulderRight");
      mat4.translate(shoulderRight.transformation, [0.35, 0.35, 0]);
      mat4.rotate   (shoulderRight.transformation, Math.PI,[1,1,0]);
      mat4.scale    (shoulderRight.transformation, shoulderSize);

      this.upperArmRight= new SceneNode("upperArmRight", [shoulderRight]);
      mat4.translate(upperArmRight.transformation, [0.35, 0.19, 0]);
      mat4.scale    (upperArmRight.transformation, upperArmSize);

      this.ellbowRight  = new SceneNode("ellbowRight", [upperArmRight]);
      mat4.translate(ellbowRight.transformation, [0.36, 0.04, 0]);
      mat4.rotate   (ellbowRight.transformation, Math.PI,[1,1,0]);
      mat4.scale    (ellbowRight.transformation, ellbowSize);

      this.foreArmRight = new SceneNode("foreArmRight", [ellbowRight]);
      mat4.translate(foreArmRight.transformation, [0.35, -0.12,0]);
      mat4.scale    (foreArmRight.transformation, foreArmSize);

      this.wristRight   = new SceneNode("wristRight", [foreArmRight]);
      mat4.translate(wristRight.transformation, [0.35,-0.29, 0]);
      mat4.rotate   (wristRight.transformation, Math.PI,[0,1,0]);
      mat4.scale    (wristRight.transformation, wristSize);



      //Left side
      this.shoulderLeft= new SceneNode("shoulderLeft");
      mat4.translate(shoulderLeft.transformation,[-0.35, 0.35, 0]);
      mat4.rotate   (shoulderLeft.transformation, Math.PI,[1,1,0]);
      mat4.scale    (shoulderLeft.transformation, shoulderSize);

      this.upperArmLeft= new SceneNode("upperArmLeft", [shoulderLeft]);
      mat4.translate(upperArmLeft.transformation,[-0.35, 0.19, 0]);
      mat4.scale    (upperArmLeft.transformation, upperArmRight);

      this.ellbowLeft  = new SceneNode("ellbowLeft", [upperArmLeft]);
      mat4.translate(ellbowLeft.transformation,[-0.36, 0.04, 0]);
      mat4.rotate   (ellbowLeft.transformation, Math.PI,[1,1,0]);
      mat4.scale    (ellbowLeft.transformation, ellbowSize);

      this.foreArmLeft = new SceneNode("foreArmLeft", [ellbowLeft]);
      mat4.translate(foreArmLeft.transformation,[-0.35, -0.12,0]);
      mat4.scale    (foreArmLeft.transformation, foreArmSize);

      this.wristLeft   = new SceneNode("wristLeft", [upperArmLeft]);
      mat4.translate(wristLeft.transformation,  [-0.35,-0.29, 0]);
      mat4.rotate   (wristLeft.transformation,   Math.PI,[0,1,0]);
      mat4.scale    (wristLeft.transformation, wristSize);


      //Skins - Right
      var torsoSkin     = new SceneNode ("torso skin", [cube], programs.vertexColor);
      mat4.scale(torsoSkin.transformation, torsoSize);

      var headSkin      = new SceneNode ("head skin", [cube], programs.vertexColor);
      mat4.rotate(headSkin.transformation, 0.6*Math.PI, [0,1,0])// color
      mat4.scale(headSkin.transformation, headSize);

      var neckSkin      = new SceneNode ("neck skin"), [band], programs.vertexColor);
      mat4.translate(halsSkin.transformation, [0,0.55,0]);
      mat4.scale(halsSkin.transformation, halsSize );

      var shoulderSkin  = new SceneNode ("shoulder skin"), [band], programs.vertexColor);

      var upperArmSkin  = new SceneNode ("upperArm skin"), [cube], programs.vertexColor);

      var ellbowSkin    = new SceneNode ("ellbow skin"), [band], programs.vertexColor);

      var foreArmSkin  = new SceneNode ("foreArm skin"), [band], programs.vertexColor);

      var wristSkin     = new SceneNode ("wrist skin"), [band], programs.vertexColor);

      

      //Connect sceleton and skins
      this.torso.addObjects([torsoSkin]);
      this.head.addObjects([headSkin]);
      this.neck.addObjects([neckSkin]);

      this.shoulderRight.addObjects([shoulderSkin]);
      this.shoulderLeft.addObjects([shoulderSkin]);
      this.upperArmRight.addObjects([upperArmSkin]);
      this.upperArmLeft.addObjects([upperArmSkin]);
      this.foreArmRight.addObjects([foreArmSkin]);
      this.foreArmLeft.addObjects([foreArmSkin]);
      this.wristRight.addObjects([wristSkin]);
      this.wristLeft.addObjects([wristSkin]);

      //the robot
      var robot = new SceneNode ("robot", [head, neck, torso, shoulderRight, shoulderLeft, 
                                  ellbowRight, ellbowLeft, upperArmRight, upperArmLeft,
                                  foreArmRight, foreArmLeft, wristRight, wristLeft]);
      mat4.translate(robot.transformation, [0,-0.5,0]);
      
      this.world = new SceneNode("world", [robot], programs.vertexColor);

    };

        window.console.log("Creating a unit Robot."); 
    
        

    // draw method: activate buffers and issue WebGL draw() method
    Robot.prototype.draw = function(gl, program, transformation) {

      this.world.draw(gl, this.program.vertexColor, transformation);

    };
        
    // this module only returns the constructor function    
    return Robot;

})); // define

    
