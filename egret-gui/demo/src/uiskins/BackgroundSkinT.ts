/**
 * Created by shaorui on 14-8-25.
 */
module uiskins
{
    export class BackgroundSkinT extends egret.gui.Skin
    {
        private bg:egret.gui.UIAsset;
        /**和组件中的定义相对应，确定皮肤应该具备哪些部件*/
        public skinParts:Array<string> = ["contentGroup"];
        /**对于SkinnableContainer来说，contentGroup是必须有的*/
        public contentGroup:egret.gui.Group;

        public constructor() {
            super();
        }
        public createChildren(): void {
            super.createChildren();
            this.states = ["normal","highlight"];
            this.bg = new egret.gui.UIAsset("app_egret_labs_jpg");
            this.bg.percentWidth = 100;//这个相当于HTML中的百分比，设置100就是100%的意思
            this.bg.percentHeight = 100;//宽和高都是100%，也就是充满整个空间咯(根据皮肤的尺寸)
            this.addElement(this.bg);
            //contentGroup必须有，否则你添加到SkinnableContainer的对象是显示不出来的
            this.contentGroup = new egret.gui.Group();
            this.addElement(this.contentGroup);
        }
        /**当状态改变时，背景和文本颜色也做相应的变化*/
        public commitCurrentState(): void {
            super.commitCurrentState();
            switch(this.currentState) {
                case "normal":
                    this.bg.source = "app_egret_labs_jpg";
                    break;
                case "highlight":
                    this.bg.source = "panel_back_png";
                    break;
            }
        }
    }
}