<template>
  <div>
    <a-row :gutter="24">
      <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
        <a-card :loading="barLoading" title="个人得分" :bordered="false">
          <a-form-item label="班级">
            <a-select
              v-model:value="classes.value"
              :default-value="classes.label"
              :key="classes.label"
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
          <a-form-item label="活动">
            <a-select
              v-model:value="active.value"
              :default-value="active.label"
              :key="active.label"
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
          <a-button
            size="small"
            type="primary"
            ghost
            icon="search"
            @click="getAllScore()"
            >查询</a-button
          >
          <div style="height: 480px">
            <a-skeleton
              :loading="barLoading"
              active
              :title="false"
              :paragraph="{ rows: 10 }"
            ></a-skeleton>
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
          :loading="lineLoading"
          style="margin-bottom: 24px"
          :bordered="false"
          :body-style="{ padding: 0 }"
        >
          <div id="line-chart" style="padding: 10px"></div>
        </a-card>
        <a-card
          title="小组得分"
          style="margin-bottom: 24px"
          :loading="pieLoading"
          :bordered="false"
          :body-style="{ padding: 0 }"
        >
          <div id="pie-chart"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerAnimation } from "@antv/g2";
import {
  //   login,
  getClassList,
  getActiveList,
  getScoreList,
  getGroupScoreList,
} from "../api";

const barLoading = ref(false); // 条形图加载
const lineLoading = ref(false); // 折线图加载
const pieLoading = ref(false); // 饼图加载

const courseId = ref("231182970"); //课程ID

const classId = ref(""); // 班级ID
const classes = ref({ value: "74784084", label: "22级大数据高考三班" });
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
const chatData: any[] = []; // 图表数据

const groupScoreData: any[] = []; // 分组分数信息

// 获取班级信息
function getAllClasses() {
  getClassList("").then((res) => {
    let arr: any = [];
    Object.keys(res.data).forEach((key: string) => {
      arr.push({ value: res.data[key], label: key });
    });
    classesData.value = arr;
    classes.value.label = classesData.value[0].label;
    classes.value.value = classesData.value[0].value;
  });
}

// 切换班级
function classesChange($event: any) {
  console.log(`selected ${$event}`);
  classId.value = $event;
}

// 获取活动信息
function getAllActive(param: any) {
  getActiveList(param).then((res) => {
    if (res.data.length > 0) {
      let arr: any = [];
      Object.keys(res.data).forEach((key: string) => {
        arr.push({ value: res.data[key], label: key });
      });
      activeData.value = arr;
      active.value.label = activeData.value[0].label;
      active.value.value = activeData.value[0].value;
    }
  });
}

// 切换活动
function activeChange($event: any) {
  console.log(`selected ${$event}`);
  activeId.value = $event;
}

// 获取个人分数信息
function getAllScore() {
  barLoading.value = true;
  const param = { activeId: activeId.value };
  getScoreList(param).then((res) => {
    if (res.data.length > 0) {
      scoreData.value = res.data;
      var data = res.data;
      for (let i = 0; i < data.length; i++) {
        chatData.push([
          data[i].uid,
          data[i].taskGroupName,
          data[i].userAttendId,
          data[i].score,
          data[i].name,
        ]);
      }
      barLoading.value = false;
      // 调用条形图
      barChartInit();
    } else {
      barLoading.value = true;
    }
  });
}

// 获取分组分数
function getGroupScore() {
  getGroupScoreList({ activeId: activeId.value }).then((res) => {
    console.log(res.data);
    if (res.data.length > 0) {
      const rd = res.data;
      for (var i = 0; i < rd.length; i++) {
        groupScoreData.push({
          groupname: rd[i].groupname,
          taskScore: rd[i].taskScore == null ? 0 : rd[i].taskScore,
        });
      }
      // 画折线图图
      lineChartInit();
      // 画饼图
      pieChartInit();
    }
    // groupScoreData = res.data;
  });
}

// 画条形图
function barChartInit() {
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

  fetch(
    "https://raw.githubusercontent.com/antvis/G2/master/examples/data/china-gdp.json"
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
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
          chart.tooltip(false);
          // chart.axis('value', false);
          chart.axis("city", {
            animateOption: {
              update: {
                duration: 1000,
                easing: "easeLinear",
              },
            },
          });
          chart.annotation().text({
            position: ["95%", "90%"],
            content: Object.keys(data)[count],
            style: {
              fontSize: 40,
              fontWeight: "bold",
              fill: "#ddd",
              textAlign: "end",
            },
            animate: false,
          });
          chart
            .interval()
            .position("city*value")
            .color("city")
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
          chart.annotation().clear(true);
          chart.annotation().text({
            position: ["95%", "90%"],
            content: Object.keys(data)[count],
            style: {
              fontSize: 40,
              fontWeight: "bold",
              fill: "#ddd",
              textAlign: "end",
            },
            animate: false,
          });
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
    });
}

// 画折线图
function lineChartInit() {
  const data = [
    { groupname: "分组一", value: 3 },
    { groupname: "分组二", value: 4 },
    { groupname: "分组三", value: 3 },
    { groupname: "分组四", value: 5 },
    { groupname: "分组五", value: 4 },
    { groupname: "分组六", value: 6 },
    { groupname: "分组七", value: 7 },
    { groupname: "分组八", value: 9 },
    { groupname: "分组九", value: 13 },
  ];
  //   for (var i = 0; i < groupScoreData.length; i++) {
  //     data.push({
  //       groupName: groupScoreData[i].groupname,
  //       value: Math.floor(Math.random() * 10),
  //     });
  //   }
  const chart = new Chart({
    container: "line-chart",
    autoFit: true,
    height: 300,
  });

  chart.data(data);
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

onMounted(async () => {
  // barChartInit();
  getAllClasses();
  //   login({}).then((res) => {
  //     console.log(res);
  //   });
  getAllActive({ courseId: courseId.value, jclassId: classes.value.value });
  getGroupScore();
  // getAllScore({ activeId: "3000065765202" });
  //   lineChartInit();
  //   pieChartInit();
});
</script>
