<template>
  <Container ref="container" class="demo-loadmore-content">
    <LoadMore @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
      <List textline="two-line" class='companyNameBox'>
        <div v-for='company in companys' :key="company.id">
          <ListItem avatar :ripple="false" button class='listItem whiteBg' @click="companyInfo(company.id)">
            <ListAction>
              <Avatar>
                <img :src="company.imgSrc" alt="">
              </Avatar>
            </ListAction>
            <ListItemContent>
              <ListItemTitle>
                {{company.name}}
              </ListItemTitle>
            </ListItemContent>
          </ListItem>
          <Divider></Divider>
        </div>
      </List>
    </LoadMore>
  </Container>
</template>

<script>
import { Toast } from 'mint-ui';
import { Container } from 'muse-ui/lib/Grid';
import {
  List,
  ListItem,
  ListAction,
  ListItemContent,
  ListItemTitle
} from 'muse-ui/lib/List';
import { Avatar, Divider, LoadMore } from 'muse-ui';
import tool from 'util/tools';
import service from 'service';
export default {
  data () {
    return {
      refreshing: false,
      loading: false,
      companys: [],
      page: 1,
      pagesize: 10,
      recommend: window.api.pageParam.recommend || ''
    };
  },
  components: {
    Container,
    List,
    ListItem,
    ListAction,
    ListItemContent,
    ListItemTitle,
    Avatar,
    Divider,
    LoadMore
  },
  computed: {
    isLoading () {
      return this.refreshing || this.loading;
    }
  },
  methods: {
    // 页面数据
    async companyRecommend () {
      tool.showProgress();
      const response = await service.companyRecommendList({
        page: this.page,
        recommend: this.recommend
      });
      tool.hideProgress();
      switch (response.code) {
        case 0:
          if (this.page === 1) {
            this.refreshing = false;
            this.companys = response.result.companys.map(message => {
              return {
                ...message
              };
            });
          }
          if (this.page > 1) {
            this.loading = false;
            response.result.companys.forEach(message => {
              this.companys.push({
                ...message
              });
            });
          }
          // this.companys = response.result.companys;
          break;
        default:
          Toast({
            position: 'top',
            message: '加载失败，请稍后重试！！'
          });
          break;
      }
    },
    refresh () {
      // this.refreshing = true;
      // this.$refs.container.scrollTop = 0;
      // setTimeout(() => {
      //   this.refreshing = false;
      //   for (let i = 0; i < 10; i++) {
      //     this.companys.push({
      //       id: 1,
      //       imgSrc: 'sdfgdfgdfg',
      //       name: 'xvxcvxcvxcvxcv'
      //     });
      //   }
      // }, 2000);
      if (!this.refreshing && !this.loading) {
        this.page = 1;
        this.refreshing = true;
        this.$refs[`container`].scrollTop = 0;
        this.companyRecommend();
      }
    },
    load () {
      // this.loading = true;
      // setTimeout(() => {
      //   this.loading = false;
      //   for (let i = 0; i < 5; i++) {
      //     this.companys.push({
      //       id: 1,
      //       imgSrc: 'dfgdfgdfg',
      //       name: 'sdfsdf'
      //     });
      //   }
      // }, 2000);
      if (!this.refreshing && !this.loading) {
        this.page = this.page + 1;
        this.loading = true;
        this.companyRecommend();
      }
    },
    companyInfo (enterpriseId) {
      tool.openWin({
        name: 'companyInfo',
        url: '../win.html',
        title: '企业介绍',
        fname: 'companyInfo_f',
        furl: './hr/companyInfo.html',
        hasLeft: 1,
        hasRight: 0,
        data: {
          enterpriseId: enterpriseId
        }
      });
    }
  },
  mounted () {
    this.refresh();
  }
};
</script>
<style lang="less" scoped>
@import url("../../../assets/css/base.less");
.container {
  padding: 0;
}

.demo-loadmore-content {
  flex: 1;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.whiteBg {
  background: #fff;
}

.companyNameBox {
  padding-top: 0px;
}

.companyNameBox .mu-item-sub-title span {
  margin-right: 10px;
}

.companyNameBox .mu-avatar img {
  border-radius: 0px;
}

.listItem:active{
   background: #f0f0f0;
}
</style>
