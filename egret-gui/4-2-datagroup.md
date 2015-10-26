Egret框架GUI教程 - DataGroup
===============

DataGroup，可以直译为"数据容器"。但叫"容器"又不太严谨，因为您不能将它当做普通容器来用，直接创建按钮什么的往里面添加是不行的，正确的做法是给它设置一个数据源，然后它自动创建内部所需的对象，来完成数据展示。也就是说，如果您要干预数据容器的显示，只能通过干预数据来实现，数据变了，显示就会变。

那么它是怎么实现这种"数据绑定+展示"的过程呢？如果您之前做过前端开发，应该对"模板"这种机制不陌生。假设有10条数据，需要用列表标签```<ul></ul>```显示出来，您所需要做的就是定义一条```<li>```的格式，至于数据条数就不是问题了，那是循环要解决的事情。

```
//伪代码
<ul>
	<%for(data each collection)%>
	<li><a href="{data.link}">{data.label}</a></li>
	<%end for%>
</ul>
```

对于DataGroup而言，也是类似的道理。您除了设置数据源，还要设置单条数据的"模板"。这个"模板"，在GUI中称之为ItemRenderer。

来看看一个DataGroup的例子吧。首先，先创建数据源：

```
//先创建一个数组
var sourceArr:any[] = [];
for (var i:number = 1; i < 5; i++)
{
    sourceArr.push({label:"item"+i});
}
//用ArrayCollection包装
var myCollection:egret.gui.ArrayCollection = new egret.gui.ArrayCollection(sourceArr);
```

然后创建DataGroup的实例，并设置数据源(属性名称是dataProvider)：

```
var dataGroup:egret.gui.DataGroup = new egret.gui.DataGroup();
dataGroup.dataProvider = myCollection;
dataGroup.percentWidth = 100;
dataGroup.percentHeight = 100;
this.addElement(dataGroup);
```

写到这里直接编译运行会发生什么？当然是什么都看不到的。我们还有两个重要的工作没有做，一个是ItemRenderer，一个ItemRenderer对应的皮肤(这一点和Flex框架不一样哦，做过Flex开发的同学小心经验主义，在Egret GUI里面，即使是ItemRenderer也是将皮肤分离的)。

ItemRenderer
-------------------------------

这个例子里，我们只需要为每一条数据显示文本即可，所以我们来创建一个简单的ItemRenderer:

```
module uiskins
{
    export class LabelRenderer extends egret.gui.ItemRenderer
    {
        public constructor(){
            super();
            this.touchChildren = true;
        }
        public dataChanged():void{
            this.labelDisplay.text = this.data.label;
        }
    }
}
```

注意两点：

* 您自定义的ItemRenderer，应该继承egret.gui.ItemRenderer，然后在内部添加您自定义的功能
* 将数据对应到显示的语句，应该放在dataChanged方法中，当数据改变并且皮肤已经创建完毕的情况下这个方法会被执行。这样的好处是，保证您调用的皮肤部件一定是实例化完成的。如果同样的逻辑，您放在data的setter中实现，就可能会遇到部件是null的情况，因为皮肤部件可能还未实例化完毕。

然后我们将自定义的ItemRenderer设置到DataGroup上：

```
dataGroup.itemRenderer = new egret.gui.ClassFactory(uiskins.LabelRenderer);
```
> 注意需要使用ClassFactory做封装，GUI将用工厂模式来生成ItemRenderer的实例

ItemRenderer的皮肤
--------------------------

和上面的LabelRenderer对应，我们来创建一个显示文本的皮肤：

```
<e:Skin xmlns:e="http://ns.egret-labs.org/egret" xmlns:w="http://ns.egret-labs.org/wing"
        height="80">
    <e:states>
        <e:State name="up" />
        <e:State name="down" />
        <e:State name="disabled" />
    </e:states>
    <e:UIAsset width="100%" height="100%"
               source.up="button_normal_png"
               source.down="button_down_png"
               source.disabled="button_disabled_png" />
    <e:Label id="labelDisplay" size="24" fontFamily="Tahoma"
             width="100%" height="100%"
             textColor="0x111111" 
             textColor.down="0xffffff" 
             textColor.disabled="0xcccccc"
             textAlign="center" 
             verticalAlign="middle" />
</e:Skin>
```
> 如果您不需要状态，也可以删除状态相关的部分(关于状态的更多信息将在后面的章节中涉及)

同样需要把这个ItemRenderer的皮肤设置到DataGroup上面：

```
dataGroup.itemRendererSkinName = "uiskins.LabelRendererSkin";
```

现在编译看看，欧耶，终于有显示效果了：

![github](https://raw.githubusercontent.com/NeoGuo/html5-documents/master/egret-gui/images/datagroup1.png "Egret")

挤到一起了，加个布局类优化一下：

```
var vLayout:egret.gui.VerticalLayout = new egret.gui.VerticalLayout();
vLayout.horizontalAlign = egret.HorizontalAlign.CONTENT_JUSTIFY;
vLayout.gap = 5;
dataGroup.layout = vLayout;
```

![github](https://raw.githubusercontent.com/NeoGuo/html5-documents/master/egret-gui/images/datagroup2.png "Egret")

竖着不爽？改成格子布局的：

```
var gridLayout:egret.gui.TileLayout = new egret.gui.TileLayout();
gridLayout.columnWidth = 240;
gridLayout.requestedColumnCount = 2;
gridLayout.paddingTop = 20;
dataGroup.layout = gridLayout;
```

![github](https://raw.githubusercontent.com/NeoGuo/html5-documents/master/egret-gui/images/datagroup3.png "Egret")

可以看出，通过ItemRenderer和布局类，DataGroup可以实现各种效果，功能灵活强大。实际上，GUI中的List, DropDownList等组件，内部也是使用了DataGroup来实现的。那么何时使用List，何时使用DataGroup？实际上，DataGroup和List的区别，就好比Goup和SkinnableContainer的区别，DataGroup是不能定制皮肤的，而List可以定制皮肤。如果不需要定制皮肤的时候，您可以选择使用DataGroup。另外，List提供了DataGroup不具备的一些功能，比如选中项，change事件等等。

一般情况下，如果List, DropDownList等组件已经满足需求，我们直接使用即可，不一定非要直接使用DataGroup。但做自定义列表的时候，DataGroup就显得非常有用了。