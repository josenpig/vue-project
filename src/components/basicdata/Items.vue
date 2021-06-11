<!-- // 子组件代码 -->
<template>
  <div class="items">
    <li @click="fn(index)" :class="{ bg: index == isactive }" ref="li">
      <span>
        {{ model.menuName }}
        <i
          v-if="model.childTree != null"
          class="el-icon-caret-bottom"
          style="border-radius: 100%; background: aliceblue"
        >
        </i>
      </span>
    </li>
    <ul v-if="isFolder" v-show="open">
      <items
        v-for="(item, index) in model.childTree"
        :model="item"
        :key="index"
      ></items>
    </ul>
  </div>
</template>

<script type="text/javascript">
export default {
  // 组件递归必要条件，name属性
  name: "items",
  props: ["model"],
  data() {
    return {
      isactive: 0,
      // 控制子列表的显示隐藏
      open: false,
    };
  },
  computed: {
    // 是否还有子列表需要渲染，作为v-if的判断条件
    isFolder() {
      return this.model.childTree && this.model.childTree.length;
    },
  },
  methods: {
    fn(index) {
      //点击切换 变量的值 赋值为 index
      this.isactive = index;
      // 切换列表显示隐藏的方法
      if (this.isFolder) {
        this.open = !this.open;
      }
    },
  },
};
</script>

<style>
.items li {
  list-style: none;
  padding: 5px;
}

.items li:hover {
  background-color: rgb(230, 243, 252);
  cursor: pointer;
}

.items .bg {
  color: black;
}
</style>
