/**
 * @author Mat Groves http://matgroves.com/
 */

/**
 * A tiling sprite is a fast way of rendering a tiling image
 *
 * @class TilingSprite
 * @extends DisplayObjectContainer
 * @constructor
 * @param texture {Texture} the texture of the tiling sprite
 * @param width {Number}  the width of the tiling sprite
 * @param height {Number} the height of the tiling sprite
 */
PIXI.TilingSprite = function(texture, width, height)
{
    PIXI.Sprite.call( this, texture);

    this.width = width || 100;
    this.height = height || 100;

    /**
     * The scaling of the image that is being tiled
     *
     * @property tileScale
     * @type Point
     */
    this.tileScale = new PIXI.Point(1,1);


    this.tileScaleOffset = new PIXI.Point(1,1);
    
    /**
     * The offset position of the image that is being tiled
     *
     * @property tilePosition
     * @type Point
     */
    this.tilePosition = new PIXI.Point(0,0);

    this.renderable = true;

    this.tint = 0xFFFFFF;
    this.blendMode = PIXI.blendModes.NORMAL;
};

// constructor
PIXI.TilingSprite.prototype = Object.create( PIXI.Sprite.prototype );
PIXI.TilingSprite.prototype.constructor = PIXI.TilingSprite;


/**
 * The width of the sprite, setting this will actually modify the scale to acheive the value set
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI.TilingSprite.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        
        this._width = value;
    }
});

/**
 * The height of the TilingSprite, setting this will actually modify the scale to acheive the value set
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI.TilingSprite.prototype, 'height', {
    get: function() {
        return  this._height;
    },
    set: function(value) {
        this._height = value;
    }
});

PIXI.TilingSprite.prototype.onTextureUpdate = function()
{
    // so if _width is 0 then width was not set..
    //console.log("HI MUM")
   

    this.updateFrame = true;
};

PIXI.TilingSprite.prototype._renderWebGL = function(renderSession)
{

    if(this.visible === false || this.alpha === 0)return;
    
    var i,j;

    if(this.mask || this.filters)
    {
        if(this.mask)
        {
            renderSession.spriteBatch.stop();
            renderSession.maskManager.pushMask(this.mask, renderSession.projection);
            renderSession.spriteBatch.start();
        }

        if(this.filters)
        {
            renderSession.spriteBatch.flush();
            renderSession.filterManager.pushFilter(this._filterBlock);
        }

        if(!this.tilingTexture)this.generateTilingTexture(true);
        else renderSession.spriteBatch.renderTilingSprite(this);

        // simple render children!
        for(i=0,j=this.children.length; i<j; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }

        renderSession.spriteBatch.stop();

        if(this.filters)renderSession.filterManager.popFilter();
        if(this.mask)renderSession.maskManager.popMask(renderSession.projection);
        
        renderSession.spriteBatch.start();
    }
    else
    {
        if(!this.tilingTexture)this.generateTilingTexture(true);
        else renderSession.spriteBatch.renderTilingSprite(this);
        
        // simple render children!
        for(i=0,j=this.children.length; i<j; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }
    }
};


PIXI.TilingSprite.prototype._renderCanvas = function(renderSession)
{
    if(this.visible === false || this.alpha === 0)return;
    
    var context = renderSession.context;

    context.globalAlpha = this.worldAlpha;

    
    var transform = this.worldTransform;

    // alow for trimming
   
    context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5]);
 

    if(!this.__tilePattern)
    {
        this.generateTilingTexture(false);
        
        if(this.tilingTexture)
        {
            this.__tilePattern = context.createPattern(this.tilingTexture.baseTexture.source, 'repeat');
        }

    }

    // check blend mode
    if(this.blendMode !== renderSession.currentBlendMode)
    {
        renderSession.currentBlendMode = this.blendMode;
        context.globalCompositeOperation = PIXI.blendModesCanvas[renderSession.currentBlendMode];
    }

    context.beginPath();

    var tilePositionX = this.tilePosition.x % this.tilingTexture.width;
    var tilePositionY = this.tilePosition.y % this.tilingTexture.height;

    var tileScale = this.tileScale;
   // console.log(tileScale.x)
    // offset
    context.scale(tileScale.x,tileScale.y);
    context.translate(tilePositionX, tilePositionY);

    context.fillStyle = this.__tilePattern;
    context.fillRect(-tilePositionX,-tilePositionY,this.width / tileScale.x, this.height / tileScale.y);

    context.scale(1/tileScale.x, 1/tileScale.y);
    context.translate(-tilePositionX, -tilePositionY);

    context.closePath();
};

PIXI.TilingSprite.prototype.getBounds = function()
{

    var width = this._width;
    var height = this._height;

    var w0 = width * (1-this.anchor.x);
    var w1 = width * -this.anchor.x;

    var h0 = height * (1-this.anchor.y);
    var h1 = height * -this.anchor.y;

    var worldTransform = this.worldTransform;

    var a = worldTransform[0];
    var b = worldTransform[3];
    var c = worldTransform[1];
    var d = worldTransform[4];
    var tx = worldTransform[2];
    var ty = worldTransform[5];

    var x1 = a * w1 + c * h1 + tx;
    var y1 = d * h1 + b * w1 + ty;

    var x2 = a * w0 + c * h1 + tx;
    var y2 = d * h1 + b * w0 + ty;

    var x3 = a * w0 + c * h0 + tx;
    var y3 = d * h0 + b * w0 + ty;

    var x4 =  a * w1 + c * h0 + tx;
    var y4 =  d * h0 + b * w1 + ty;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var minX = Infinity;
    var minY = Infinity;

    minX = x1 < minX ? x1 : minX;
    minX = x2 < minX ? x2 : minX;
    minX = x3 < minX ? x3 : minX;
    minX = x4 < minX ? x4 : minX;

    minY = y1 < minY ? y1 : minY;
    minY = y2 < minY ? y2 : minY;
    minY = y3 < minY ? y3 : minY;
    minY = y4 < minY ? y4 : minY;

    maxX = x1 > maxX ? x1 : maxX;
    maxX = x2 > maxX ? x2 : maxX;
    maxX = x3 > maxX ? x3 : maxX;
    maxX = x4 > maxX ? x4 : maxX;

    maxY = y1 > maxY ? y1 : maxY;
    maxY = y2 > maxY ? y2 : maxY;
    maxY = y3 > maxY ? y3 : maxY;
    maxY = y4 > maxY ? y4 : maxY;

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    // store a refferance so that if this function gets called again in the render cycle we do not have to recacalculate
    this._currentBounds = bounds;

    return bounds;
};


PIXI.TilingSprite.prototype.generateTilingTexture = function(forcePowerOfTwo)
{
    var texture = this.texture;

    if(!texture.baseTexture.hasLoaded)return;

    var baseTexture = texture.baseTexture;
    var frame = texture.frame;

    var targetWidth, targetHeight;

    // check that the frame is the same size as the base texture.
    
    var isFrame = frame.width !== baseTexture.width || frame.height !== baseTexture.height;

    this.tilingTexture = texture;

    var newTextureRequired = false;

    if(!forcePowerOfTwo)
    {
        if(isFrame)
        {
            targetWidth = frame.width;
            targetHeight = frame.height;
            
            newTextureRequired = true;
        }
    }
    else
    {
        targetWidth = PIXI.getNextPowerOfTwo(texture.frame.width);
        targetHeight = PIXI.getNextPowerOfTwo(texture.frame.height);

        if(frame.width !== targetWidth && frame.height !== targetHeight)newTextureRequired = true;
    }

    if(newTextureRequired)
    {
        var canvasBuffer = new PIXI.CanvasBuffer(targetWidth, targetHeight);
        
        canvasBuffer.context.drawImage(texture.baseTexture.source,
                                       frame.x,
                                       frame.y,
                                       frame.width,
                                       frame.height,
                                       0,
                                       0,
                                       targetWidth,
                                       targetHeight);

        this.tilingTexture = PIXI.Texture.fromCanvas(canvasBuffer.canvas);

        this.tileScaleOffset.x = frame.width / targetWidth;
        this.tileScaleOffset.y = frame.height / targetHeight;
    }

   
    this.tilingTexture.baseTexture._powerOf2 = true;
};