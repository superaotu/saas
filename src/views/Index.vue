<template>
  <div>
    <page-container style="padding: 10px">
      <template #content>
        <a-form ref="formRef" :model="formState" :rules="rules">
          <a-form-item ref="classes" label="班级" name="classes">
            <a-select
              v-model:value="formState.classes"
              :placeholder="classesPlaceholder"
              style="width: 100%"
              @change="classesChange($event)"
            >
              <a-select-option
                v-for="item in classesData"
                :key="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item ref="active" label="活动" name="active">
            <a-select
              v-model:value="formState.active"
              :placeholder="activePlaceholder"
              style="width: 100%"
              @change="activeChange($event)"
            >
              <a-select-option
                v-if="activeData.length > 0"
                v-for="item in activeData"
                :key="item.label"
                :value="item.value"
                label-in-value
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 16, offset: 4 }">
            <a-button type="primary" @click="query">
              <SearchOutlined />
              查询
            </a-button>
            <a-button style="margin-left: 10px" @click="reset"> 重置 </a-button>
          </a-form-item>
        </a-form>
      </template>
    </page-container>
    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            title="个人得分"
            :bordered="false"
            :body-style="{ minHeight: 480 }"
          >
            <div style="height: 480px">
              <a-empty v-show="scoreData.length == 0" :image="simpleImage" />
              <div id="bar-chart"></div>
            </div>
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <a-card
            title="小组活动次数"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div style="height: 300px">
              <a-empty
                v-show="lineChartData.length == 0"
                :image="simpleImage"
              />
              <!-- <a-spin v-show="lineLoading" /> -->
              <div id="line-chart" style="padding: 10px"></div>
            </div>
          </a-card>
          <a-card
            title="小组得分"
            style="margin-top: 10px"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div style="height: 300px">
              <a-empty
                style="height: 100%"
                v-show="groupScoreData.length == 0"
                :image="simpleImage"
              />
              <div id="pie-chart"></div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UnwrapRef } from "vue";
// @ts-ignore
import { PageContainer } from "@ant-design-vue/pro-layout";
import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { SearchOutlined } from "@ant-design/icons-vue";
import { Chart, registerAnimation } from "@antv/g2";
import { Empty } from "ant-design-vue";
import {
  // login,
  getClassList,
  getActiveList,
  getScoreList,
  getGroupScoreList,
} from "../api";

interface FormState {
  classes: string | undefined;
  active: string | undefined;
}

const formRef = ref();

const formState: UnwrapRef<FormState> = reactive({
  classes: undefined,
  active: undefined,
});

const rules = ref({
  classes: [{ required: true, message: "请选择班级", trigger: "blur" }],
  active: [{ required: true, message: "请选择活动", trigger: "blur" }],
});

const simpleImage = ref(Empty.PRESENTED_IMAGE_SIMPLE);

const barLoading = ref(false); // 条形图加载
const lineLoading = ref(true); // 折线图加载
const pieLoading = ref(false); // 饼图加载

// const barChart:any;
// const lineChart:any;
// const pieChart:any;

// const courseId = ref("231182970"); //课程ID
const courseId = ref("234933541"); //课程ID

const classId = ref(""); // 班级ID
const classesPlaceholder = ref("请选择班级");

const activeId = ref("3000065765202"); // 活动ID
// const activeId = ref("6000066905426"); // 活动ID

const active = ref({ value: "", label: "" });
const activePlaceholder = ref("请选择活动");
// const courseData = ref([{ value: "", label: "" }]); // 课程信息
const classesData = ref([{ value: "", label: "" }]); // 班级信息
const activeData = ref([{ value: "", label: "" }]); // 活动信息
// @ts-ignore
const scoreData = ref([]); // 分数信息
const barChatData = {}; // 排名图数据
const lineChartData: any[] = []; // 折线图数据

const groupScoreData: any[] = []; // 分组分数信息

// 获取班级信息
function getAllClasses() {
  getClassList("").then((res) => {
    let arr: any = [];
    Object.keys(res.data).forEach((key: string) => {
      arr.push({ value: res.data[key], label: key });
    });
    classesData.value = arr;
  });
}

// 切换班级
function classesChange($event: any) {
  console.log(`selected ${$event} `);
  // console.log(formState.classes);
  classId.value = $event;
  // 获取活动信息
  getAllActive({
    courseId: courseId.value,
    jclassId: classId.value,
  });
}

// 获取活动信息
function getAllActive(param: any) {
  getActiveList(param).then((res) => {
    if (res.data.length > 0) {
      let arr: any = [];
      Object.keys(res.data).forEach((key: string) => {
        arr.push({ value: res.data[key].id, label: res.data[key].name });
      });
      activeData.value = arr;
    }
  });
}

// 切换活动
function activeChange($event: any) {
  console.log(`selected ${$event}`);
  activeId.value = $event;
}

const t: any = ref(0);

// 获取个人分数信息
function getAllScore(param: any) {
  // 获取个人分数
  getScoreList(param).then((res) => {
    if (res.data.length > 0) {
      scoreData.value = res.data;
      var data = res.data;
      const d = [];
      for (let i = 0; i < data.length; i++) {
        d.push({
          value: data[i].score == null ? 0 : data[i].score,
          name: data[i].name,
        });
      }
      t.value++;
      // @ts-ignore
      barChatData['"' + t.value + '"'] = d;
      barLoading.value = false;
    } else {
      barLoading.value = true;
    }
  });
}

// 获取分组分数
function getGroupScore() {
  lineLoading.value = true;
  pieLoading.value = true;
  getGroupScoreList({ activeId: activeId.value }).then((res) => {
    // console.log(res.data);
    if (res.data.length > 0) {
      const rd = res.data;
      for (var i = 0; i < rd.length; i++) {
        groupScoreData.push({
          groupname: rd[i].groupname,
          taskScore: rd[i].taskScore == null ? 0 : rd[i].taskScore,
        });
      }
      lineLoading.value = false;
      pieLoading.value = false;
    } else {
      lineLoading.value = true;
      pieLoading.value = true;
    }
  });
}

// 查询
function query() {
  formRef.value
    .validate()
    .then(() => {
      barLoading.value = true;
      lineLoading.value = true;
      pieLoading.value = true;
      var n = 10;
      var timeId = setInterval(function () {
        n--;
        if (n <= 0) {
          clearInterval(timeId);
          barChartInit(barChatData);
        }
        // 获取个人分数
        getAllScore({ activeId: activeId.value, classId: classId.value });
        console.log(barChatData);
      }, 1000 * 10);
      // 获取分组分数
      getGroupScore();
      // 画折线图
      lineChartInit();
      // 画饼图
      pieChartInit();
    })
    .catch((error: ValidateErrorEntity<FormState>) => {
      console.log("error", error);
    });
}

// 重置
function reset() {
  formRef.value.resetFields();
}

// 画条形图
function barChartInit(data: object) {
  registerAnimation("label-appear", (element, animateCfg, cfg) => {
    // @ts-ignore
    const label = element.getChildren()[0];
    const coordinate = cfg.coordinate;
    const startX = coordinate.start.x;
    const finalX = label.attr("x");
    const labelContent = label.attr("text");
    label.attr("x", startX);
    label.attr("text", 0);
    const distance = finalX - startX;
    label.animate((ratio: any) => {
      const position = startX + distance * ratio;
      const text = (labelContent * ratio).toFixed(0);
      return {
        x: position,
        text,
      };
    }, animateCfg);
  });

  registerAnimation("label-update", (element, animateCfg, cfg) => {
    const startX = element.attr("x");
    const startY = element.attr("y");
    // @ts-ignore
    const finalX = cfg.toAttrs.x;
    // @ts-ignore
    const finalY = cfg.toAttrs.y;
    const labelContent = element.attr("text");
    // @ts-ignore
    const finalContent = cfg.toAttrs.text;

    const distanceX = finalX - startX;
    const distanceY = finalY - startY;
    const numberDiff = +finalContent - +labelContent;

    element.animate((ratio: any) => {
      const positionX = startX + distanceX * ratio;
      const positionY = startY + distanceY * ratio;
      const text = (+labelContent + numberDiff * ratio).toFixed(0);

      return {
        x: positionX,
        y: positionY,
        text,
      };
    }, animateCfg);
  });

  function handleData(source: any) {
    source.sort((a: any, b: any) => {
      return a.value - b.value;
    });
    return source;
  }
  let count = 0;
  let chart: any;
  let interval: any;

  function countUp() {
    if (count === 0) {
      chart = new Chart({
        container: "bar-chart",
        autoFit: true,
        height: 480,
        padding: [20, 60],
      });
      // @ts-ignore
      chart.data(handleData(Object.values(data)[count]));
      chart.coordinate("rect").transpose();
      chart.legend(false);
      chart.tooltip(true);
      chart.axis("name", {
        animateOption: {
          update: {
            duration: 1000,
            easing: "easeLinear",
          },
        },
      });
      // chart.annotation().text({
      //   position: ["95%", "90%"],
      //   content: Object.keys(data)[count],
      //   style: {
      //     fontSize: 40,
      //     fontWeight: "bold",
      //     fill: "#ddd",
      //     textAlign: "end",
      //   },
      //   animate: false,
      // });
      chart
        .interval()
        .position("name*value")
        .color("name")
        // @ts-ignore
        .label("value", (value) => {
          // if (value !== 0) {
          return {
            animate: {
              appear: {
                animation: "label-appear",
                delay: 0,
                duration: 1000,
                easing: "easeLinear",
              },
              update: {
                animation: "label-update",
                duration: 1000,
                easing: "easeLinear",
              },
            },
            offset: 5,
          };
          // }
        })
        .animate({
          appear: {
            duration: 1000,
            easing: "easeLinear",
          },
          update: {
            duration: 1000,
            easing: "easeLinear",
          },
        });

      chart.render();
    } else {
      // chart.annotation().clear(true);
      // chart.annotation().text({
      //   position: ["95%", "90%"],
      //   content: Object.keys(data)[count],
      //   style: {
      //     fontSize: 40,
      //     fontWeight: "bold",
      //     fill: "#ddd",
      //     textAlign: "end",
      //   },
      //   animate: false,
      // });
      // @ts-ignore
      chart.changeData(handleData(Object.values(data)[count]));
    }

    ++count;

    if (count === Object.keys(data).length) {
      clearInterval(interval);
    }
  }

  countUp();
  interval = setInterval(countUp, 1200);
  // });
}

// 画折线图
function lineChartInit() {
  if (groupScoreData.length > 0) {
    for (var i = 0; i < groupScoreData.length; i++) {
      lineChartData.push({
        groupName: groupScoreData[i].groupname,
        value: Math.floor(Math.random() * 10),
      });
    }
  } else {
    lineChartData.push(
      { groupname: "分组一", value: 3 },
      { groupname: "分组二", value: 4 },
      { groupname: "分组三", value: 3 },
      { groupname: "分组四", value: 5 },
      { groupname: "分组五", value: 4 },
      { groupname: "分组六", value: 6 },
      { groupname: "分组七", value: 7 },
      { groupname: "分组八", value: 9 },
      { groupname: "分组九", value: 13 }
    );
  }

  const chart = new Chart({
    container: "line-chart",
    autoFit: true,
    height: 300,
  });

  chart.data(lineChartData);
  chart.scale({
    year: {
      range: [0, 1],
    },
    value: {
      min: 0,
      nice: true,
    },
  });

  chart.tooltip({
    showCrosshairs: true, // 展示 Tooltip 辅助线
    shared: true,
  });

  chart.line().position("groupname*value").label("value");
  chart.point().position("groupname*value");

  chart.render();
}

// 画饼图
function pieChartInit() {
  const chart = new Chart({
    container: "pie-chart",
    autoFit: true,
    height: 300,
  });

  chart.coordinate("theta", {
    radius: 0.75,
  });

  chart.data(groupScoreData);

  chart.tooltip({
    showTitle: false,
    showMarkers: false,
  });

  chart
    .interval()
    .position("taskScore")
    .color("groupname")
    .label("groupname*taskScore", {
      layout: [
        { type: "pie-spider" },
        {
          type: "limit-in-plot",
          cfg: { action: "ellipsis" /** 或 translate */ },
        },
      ],
      labelHeight: 20,
      content: (obj) => `${obj.groupname} (${obj.taskScore})`,
      labelLine: {
        style: {
          lineWidth: 0.5,
        },
      },
    })
    .adjust("stack");
  chart.interaction("element-active");
  chart.render();
}

onMounted(() => {
  // barChartInit();
  getAllClasses();
  // login({}).then((res) => {
  //   console.log(res);
  // });
  //   getAllActive({ courseId: courseId.value, jclassId: classes.value.value });
  //   getGroupScore();
  // getAllScore({ activeId: "3000065765202" });
  //   lineChartInit();
  //   pieChartInit();
});
</script>
<style>
.ant-page-header {
  margin: 10px;
}
</style>
