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
import { Chart, registerAnimation, Util } from "@antv/g2";
import { login, getClassList, getActiveList, getScoreList } from "../api";

const barLoading = ref(false); // 条形图加载
const lineLoading = ref(false); // 折线图加载
const pieLoading = ref(false); // 饼图加载

const courseId = ref("231182970"); //课程ID

const classId = ref(""); // 班级ID
const classes = ref({ value: "74784084", label: "22级大数据高考三班" });
const classesPlaceholder = ref("请选择班级");

const activeId = ref("3000065765202"); // 活动ID
const active = ref({ value: "", label: "" });
const activePlaceholder = ref("请选择活动");
// const courseData = ref([{ value: "", label: "" }]); // 课程信息
const classesData = ref([{ value: "", label: "" }]); // 班级信息
const activeData = ref([{ value: "", label: "" }]); // 活动信息
// @ts-ignore
const scoreData = ref([]); // 分数信息

const chatData: any[] = []; // 图表数据

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
  // 默认已经加载 legend-filter 交互
  const data = [
    { month: "Jan", city: "Tokyo", temperature: 7 },
    { month: "Jan", city: "London", temperature: 3.9 },
    { month: "Feb", city: "Tokyo", temperature: 6.9 },
    { month: "Feb", city: "London", temperature: 4.2 },
    { month: "Mar", city: "Tokyo", temperature: 9.5 },
    { month: "Mar", city: "London", temperature: 5.7 },
    { month: "Apr", city: "Tokyo", temperature: 14.5 },
    { month: "Apr", city: "London", temperature: 8.5 },
    { month: "May", city: "Tokyo", temperature: 18.4 },
    { month: "May", city: "London", temperature: 11.9 },
    { month: "Jun", city: "Tokyo", temperature: 21.5 },
    { month: "Jun", city: "London", temperature: 15.2 },
    { month: "Jul", city: "Tokyo", temperature: 25.2 },
    { month: "Jul", city: "London", temperature: 17 },
    { month: "Aug", city: "Tokyo", temperature: 26.5 },
    { month: "Aug", city: "London", temperature: 16.6 },
    { month: "Sep", city: "Tokyo", temperature: 23.3 },
    { month: "Sep", city: "London", temperature: 14.2 },
    { month: "Oct", city: "Tokyo", temperature: 18.3 },
    { month: "Oct", city: "London", temperature: 10.3 },
    { month: "Nov", city: "Tokyo", temperature: 13.9 },
    { month: "Nov", city: "London", temperature: 6.6 },
    { month: "Dec", city: "Tokyo", temperature: 9.6 },
    { month: "Dec", city: "London", temperature: 4.8 },
  ];

  const chart = new Chart({
    container: "line-chart",
    autoFit: true,
    height: 220,
    // padding: [20],
  });

  chart.data(data);
  chart.scale({
    month: {
      range: [0, 1],
    },
    temperature: {
      nice: true,
    },
  });

  chart.tooltip({
    showCrosshairs: true,
    shared: true,
  });

  chart.axis("temperature", {
    label: {
      formatter: (val) => {
        // return val + "次";
        return val;
      },
    },
  });

  chart.line().position("month*temperature").color("city").shape("smooth");

  chart
    .point()
    .position("month*temperature")
    .color("city")
    .shape("circle")
    .style({
      stroke: "#fff",
      lineWidth: 1,
    });

  chart.render();
}

// 画饼图
function pieChartInit() {
  const data = [
    { type: "一组", value: 0.19 },
    { type: "二组", value: 0.21 },
    { type: "三组", value: 0.27 },
    { type: "四组", value: 0.33 },
  ];
  const chart = new Chart({
    container: "pie-chart",
    autoFit: true,
    height: 300,
    // padding: [20],
  });
  chart.data(data);

  chart.coordinate("theta", {
    radius: 0.75,
  });
  chart.tooltip({
    showMarkers: false,
  });
  // @ts-ignore
  const interval = chart
    .interval()
    .adjust("stack")
    .position("value")
    .color("type", ["#063d8a", "#1770d6", "#47abfc", "#38c060"])
    .style({ opacity: 0.4 })
    .state({
      active: {
        style: (element) => {
          const shape = element.shape;
          return {
            matrix: Util.zoom(shape, 1.1),
          };
        },
      },
    })
    .label("type", (val) => {
      const opacity = val === "四线及以下" ? 1 : 0.5;
      return {
        offset: -30,
        style: {
          opacity,
          fill: "white",
          fontSize: 12,
          shadowBlur: 2,
          shadowColor: "rgba(0, 0, 0, .45)",
        },
        content: (obj) => {
          return obj.type + "\n" + obj.value + "%";
        },
      };
    });

  chart.interaction("element-single-selected");
  chart.render();
}

onMounted(async () => {
  // barChartInit();
  getAllClasses();
  login({}).then((res) => {
    console.log(res);
  });
  getAllActive({ courseId: courseId.value, jclassId: classes.value.value });
  // getAllScore({ activeId: "3000065765202" });
  lineChartInit();
  pieChartInit();
});
</script>
