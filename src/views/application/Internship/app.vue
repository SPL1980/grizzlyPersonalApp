<template>
  <Container class="demo-loadmore-content" ref="container">
    <LoadMore @refresh="refresh" :refreshing="refreshing">
      <Row>
        <Col span="12">
        <div class="grid-cell" @click='internshipAgreement'>
          <section><span class='cBlue'><i class='iconfont icon-xieyi'></i></span>实习协议</section>
        </div>
        </Col>
        <Col span="12">
        <div class="grid-cell" @click='internshipAssessment'>
          <section><span class='cRed'><i class='iconfont icon-kaohepingjia'></i></span>实习考核</section>
          <p class='status'>{{assessmentStatus}}</p>
        </div>
        </Col>
        <Col span="12">
        <div class="grid-cell" @click='internshipPlan'>
          <section><span class='cYellow'><i class='iconfont icon-jihua'></i></span>实习计划</section>
        </div>
        </Col>
        <Col span="12">
        <div class="grid-cell" @click='internshipReport'>
          <section><span class='cPurple'><i class='iconfont icon-baogao'></i></span>实习报告</section>
        </div>
        </Col>
        <Col span="12">
        <div class="grid-cell" @click='internshipLog'>
          <section><span class='cLightGreen'><i class='iconfont icon-rizhi'></i></span>实习日志 </section>
        </div>
        </Col>
        <Col span="12">
        <div class="grid-cell" @click='internshipSummary'>
          <section><span class='cBrown'><i class='iconfont icon-zongjie'></i></span>实习总结</section>
        </div>
        </Col>
      </Row>
    </LoadMore>
  </Container>
</template>

<script>
import { Row, Col, Container } from "muse-ui/lib/Grid";
import tool from "util/tools";
import service from "service";
import { Toast } from "mint-ui";
import { LoadMore } from "muse-ui";
export default {
  data() {
    return {
      companyId: window.api.pageParam.companyId,
      companyName: window.api.pageParam.companyName,
      department: window.api.pageParam.department,
      group: window.api.pageParam.group,
      internshipAssessmentStatus: "",
      assessmentStatus: "",
      refreshing: false
    };
  },
  components: {
    Row,
    Col,
    Container,
    LoadMore
  },
  methods: {
    refresh() {
      this.refreshing = true;
      this.$refs.container.scrollTop = 0;
      setTimeout(() => {
        this.refreshing = false;
        this.getInternshipAssessmentStatus();
      }, 200);
    },
    async internshipAgreement() {
      const response = await service.internshipAgreement({
        companyId: this.companyId
      });
      switch (response.code) {
        case 0:
          tool.openWin({
            name: "agreementDetails",
            url: "../win.html",
            title: "实习协议",
            fname: "agreementDetails_f",
            furl: "./application/agreementDetails.html",
            hasLeft: 1
          });
          break;
        default:
          Toast({
            position: "top",
            message: "加载失败，请稍后重试！！"
          });
          break;
      }
    },
    //获取实习考核状态码
    async getInternshipAssessmentStatus() {
      const response = await service.internshipAssessmentStatus({
        enterpriseid: this.companyId
      });
      switch (response.code) {
        case 0:
          this.internshipAssessmentStatus = response.result;
          switch (this.internshipAssessmentStatus) {
            case -1:
              this.assessmentStatus = "待申请";
              break;
            case 0:
              this.assessmentStatus = "待考评";
              break;
            case 1:
              this.assessmentStatus = "已考评";
              break;
            default:
              Toast({
                position: "top",
                message: "加载失败，请稍后重试！！"
              });
              break;
          }
          console.log(response.result);
          break;
        default:
          Toast({
            position: "top",
            message: "加载失败，请稍后重试！！"
          });
          break;
      }
    },
    // 判断状态码进行跳转相应实习考核页面
    internshipAssessment() {
      switch (this.internshipAssessmentStatus) {
        case -1:
          tool.openWin({
            name: "internshipAssessment",
            url: "../win.html",
            title: "实习考核",
            fname: "internshipAssessment_f",
            furl: "./application/internshipAssessment.html",
            hasLeft: 1,
            data: {
              companyId: this.companyId,
              companyName: this.companyName,
              department: this.department,
              group: this.group,
              callback: (ret, err) => {
                this.getInternshipAssessmentStatus();
              }
            }
          });
          break;
        case 0:
          tool.openWin({
            name: "internshipAssessmentDetail",
            url: "../win.html",
            title: "实习考核",
            fname: "internshipAssessmentDetail_f",
            furl: "./application/internshipAssessmentDetail.html",
            hasLeft: 1,
            data: {
              companyId: this.companyId,
              companyName: this.companyName,
              department: this.department,
              group: this.group,
              callback: (ret, err) => {
                this.getInternshipAssessmentStatus();
              }
            }
          });
          break;
        case 1:
          tool.openWin({
            name: "internshipAssessmentEvaluation",
            url: "../win.html",
            title: "实习考核",
            fname: "internshipAssessmentEvaluation_f",
            furl: "./application/internshipAssessmentEvaluation.html",
            hasLeft: 1,
            data: {
              companyId: this.companyId,
              companyName: this.companyName,
              department: this.department,
              group: this.group,
              callback: (ret, err) => {
                this.getInternshipAssessmentStatus();
              }
            }
          });
          break;
        default:
          Toast({
            position: "top",
            message: "加载失败，请稍后重试！！"
          });
          break;
      }
    },
    // 跳转进实习计划页面
    internshipPlan() {
      tool.openWin({
        name: "internshipPlan",
        url: "../win.html",
        title: "实习计划",
        fname: "internshipPlan_f",
        furl: "./application/internshipPlan.html",
        hasLeft: 1,
        data: {
          companyId: this.companyId
        }
      });
    },
    internshipReport() {
      tool.openWin({
        name: "internshipReport",
        url: "../win.html",
        title: "实习报告",
        fname: "internshipReport_f",
        furl: "./application/internshipReport.html",
        hasLeft: 1
      });
    },
    internshipLog() {
      tool.openWin({
        name: "internshipLog",
        url: "../win.html",
        title: "实习日志",
        fname: "internshipLog_f",
        furl: "./application/internshipLog.html",
        hasLeft: 1
      });
    },
    internshipSummary() {
      tool.openWin({
        name: "internshipSummary",
        url: "../win.html",
        title: "实习总结",
        fname: "internshipSummary_f",
        furl: "./application/internshipSummary.html",
        hasLeft: 1
      });
    }
  },
  mounted() {
    // this.internshipAgreement();
    this.getInternshipAssessmentStatus();
    this.refresh();
  }
};
</script>
<style lang="less" scoped>
@import url("../../../assets/css/base.less");
.mu-card {
  box-shadow: none;
}

.container {
  background: #fff;
}

.grid-cell {
  display: flex;
  padding: 10px 15px 10px 0;
  align-items: center;
  justify-content: space-between;
  color: #333;
}

.grid-cell section {
  width: 80%;
  display: flex;
  align-items: center;
}

.col {
  border-bottom: 1px solid #f5f5f5;
}

.grid-cell span {
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  margin-right: 15px;
}

.grid-cell .iconfont {
  font-size: 22px;
  color: #fff;
}

.cBlue {
  background: #a0d2f7;
}

.cYellow {
  background: #f8dc1c;
}

.cPurple {
  background: #eb8af7;
}

.cLightGreen {
  background: #68dcb7;
}

.cRed {
  background: #f9876c;
}

.cBrown {
  background: #a45a49;
}

.status {
  color: red;
  margin: 0;
}
</style>
