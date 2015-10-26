Egret框架入门第一步 - 容器
===============

Egret的显示列表机制，和原生Flash的显示列表机制是非常相似的，但也在某种程度上做了简化。比如显示对象容器，可以直接使用DisplayObjectContainer，而在Flash中，我们只能使用DisplayObjectContainer的子类，比如Sprite和MovieClip，这一点上注意Egret和Flash的区别。

至于显示列表的具体特性，可以看下面的代码片段：

```
//和Flash机制类似，stage是所有显示对象的'根'，stage下面是一个树状的显示列表
//同时Egret的显示列表相对于原生Flash也做了一些简化
//显示对象容器，使用DisplayObjectContainer
var container = new egret.DisplayObjectContainer();
//容器的缩放，旋转，位移将影响到它下面的子节点(即包含的显示对象)
container.scaleX = 0.2;
container.scaleY = 0.2;
//和Flash一样，用addChild方法把一个显示对象添加到显示列表
this.addChild(container);
//位图是显示对象，纹理不是
var bitmap1 = new egret.Bitmap(RES.getRes("egretIcon"));
container.addChild(bitmap1);
//显示对象的位置和尺寸，相对于stage来说，也受到父容器的影响，也就是说每个显示对象容器，拥有自己的坐标系
bitmap1.x = bitmap1.y = 50;
```

和Flash太相似了，呵呵，会Flash的同学可以很快略过这个篇幅了。

注意这几个特性：
```
DisplayObjectContainer.touchChildren
```
> 这个属性等同于Flash中的mouseChildren，在实施性能优化的时候应该很有用。

```
DisplayObjectContainer.removeChildren
```
> 移除所有显示对象，一个方便使用的快捷方法

其实Egret也提供了Sprite类，用法：

```
var sprite:egret.Sprite = new egret.Sprite();//Sprite与DisplayObjectContainer基本类似
sprite.graphics.beginFill(0xFF0000,1);//区别是Sprite拥有graphics对象可用于画图
sprite.graphics.drawRect(0,0,100,100);
sprite.graphics.endFill();
sprite.y = 300;
this.addChild(sprite);
```

如果容器不需要画图功能，我们可以直接用DisplayObjectContainer；需要画图的时候就用Sprite。

- - -

[上一篇:声音](https://github.com/NeoGuo/html5-documents/blob/master/egret/06-sound.md)
| [下一篇:事件](https://github.com/NeoGuo/html5-documents/blob/master/egret/08-event.md)
