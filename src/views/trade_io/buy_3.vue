<template>
  <div class="border-box">
    <step :step-index="3"></step>
    <div class="main">
      <h3 class="title">请选择支付方式：</h3>
      <div class="pay-chs">
        <!--<div class="item" :class="{active:open_paypal}" @click="open_paypal = true">
          <div class="logo-wrap">
            <i class="iconfont iconpaypal" v-if="open_paypal === false"></i>
            <i class="iconfont iconpaypalcolor" v-else></i>
          </div>
        </div>-->
        <!--<div class="item" :class="{active:open_wx}" @click="open_wx = true">
          <div class="logo-wrap">
            <i class="iconfont iconweixin"></i><span class="wx center">微信支付</span>
          </div>
        </div>-->
        <div class="item" :class="{ active: open_alipay }" @click="alipay">
          <div class="logo-wrap">
            <i class="iconfont iconzhifubao"></i>
            <span class="alipay center">支付宝</span>
          </div>
        </div>
        <div
          class="item"
          :class="{ active: open_paypal }"
          @click="open_paypal = true"
        >
          <div class="logo-wrap">
            <span class="center"
              ><PayPal
                :amount="Amount"
                currency="USD"
                :button-style="myStyle"
                v-on:payment-authorized="paymentAuthorized"
                v-on:payment-completed="paymentCompleted"
                v-on:payment-cancelled="paymentCancelled"
                :client="paypal"
              >
              </PayPal
            ></span>
          </div>
        </div>
      </div>
      <div class="trade-bottom-wrap">
        <div></div>
        <span class="service">
          客服支持：
          <a href="mailto:support@dbctrade.io">support@dbctrade.io</a>
          ,客服会在24小时内回复
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Step from "@/components/trade_io/stepNavi";
import { create_order_dbctrade } from "@/api";
import PayPal from "vue-paypal-checkout";
import { mapActions, mapState } from "vuex";

export default {
  name: "buy_3",
  data() {
    return {
      open_paypal: false,
      open_wx: false,
      open_alipay: false,
      paypal: {
        sandbox:
          "ATgM623Vycp1bfDenPQfkqExVvdD0IklMOW_Zm9il5kYuDctzVw9npqtoVYqfxhEFLiDgNdZx2ZMaa1m",
        production:
          "Ac-s32TtgObC0Yii7YqfatEn90h39EQJ3pDKT9fLK1i9XG7Jt_4_0MgQT6-p9BZXKkw0ua4OJ-X8hgFK"
      },
      myStyle: {
        label: "checkout",
        size: "medium",
        shape: "pill",
        color: "blue"
      },
      Amount: 0,
      OrderID: this.$route.query.order_id
    };
  },
  created() {
    this.RMBtoUSD();
    this.getExchangeRate();
    this.getRateForUSDToCNY();
  },
  computed: {
    ...mapState(["dbcToUS", "USDToCNY"])
    //computedDBC() {}
  },
  methods: {
    ...mapActions(["getExchangeRate", "getRateForUSDToCNY"]),
    RMBtoUSD() {
      this.Amount = (
        (this.$route.query.rmb / this.USDToCNY + 0.3) /
        0.97
      ).toFixed(2);
    },
    create_order() {
      create_order_dbctrade({
        order_id: this.order_id,
        count: this.rmb
      }).then(res_1 => {
        if (res_1.status === 1) {
          this.dbc = res_1.content;
          this.$router.push({
            path: "/trade/buy_2",
            query: {
              order_id: this.order_id,
              ...this.$route.query
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: "无法创建购买订单，请稍后再试",
            type: "error"
          });
          return Promise.reject(res_1.msg);
        }
      });
    },
    alipay() {
      window.open(
        `https://info.dbchain.ai/pay/create_order?count=${this.$route.query.rmb}&order_id=${this.$route.query.order_id}`
      );
      this.$confirm(
        "请在新打开的页面完成支付，支付完成前请不要关闭窗口。",
        "支付确认",
        {
          confirmButtonText: "支付完成",
          cancelButtonText: "更换支付方式"
        }
      )
        .then(() => {
          this.$router.push({
            path: "/trade/buy_4",
            query: {
              order_id: this.order_id,
              ...this.$route.query
            }
          });
        })
        .catch(() => {});
    },
    paymentAuthorized: function(data) {
      console.log(data);
    },
    paymentCompleted: function(data) {
      console.log(data);
      this.$confirm(
        "请在新打开的页面完成支付，支付完成前请不要关闭窗口。",
        "支付确认",
        {
          confirmButtonText: "支付完成",
          cancelButtonText: "更换支付方式"
        }
      )
        .then(() => {
          this.$router.push({
            path: "/trade/buy_4",
            query: {
              order_id: this.order_id,
              ...this.$route.query
            }
          });
        })
        .catch(() => {});
    },
    paymentCancelled: function(data) {
      console.log(data);
      this.$confirm(
        "请在新打开的页面完成支付，支付完成前请不要关闭窗口。",
        "支付确认",
        {
          confirmButtonText: "支付完成",
          cancelButtonText: "更换支付方式"
        }
      )
        .then(() => {
          this.$router.push({
            path: "/trade/buy_4",
            query: {
              order_id: this.order_id,
              ...this.$route.query
            }
          });
        })
        .catch(() => {});
    },
    clickPay() {}
  },
  components: {
    Step,
    PayPal
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/variables.scss";

.border-box {
  padding: 30px 0;
}
.main {
  padding: 30px;
}
.title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 20px;
  color: #47495a;
}

.trade-bottom-wrap {
  margin-top: 30px;
}
.pay-chs {
  display: flex;
  justify-content: left;
  .item {
    box-sizing: border-box;
    width: 352px;
    height: 137px;
    border: 1px solid rgba(25, 66, 214, 0.3);
    background-color: rgb(255, 255, 255);

    text-align: center;
    cursor: pointer;
    transition: all 300ms;
    .logo-wrap {
      margin-top: 44px;
      font-size: 30px;
      line-height: 50px;
      color: #7a8ca1;
      transition: all 300ms;
    }
    span {
      display: inline-block;
      vertical-align: middle;
    }
    .iconpaypal {
      display: inline-block;
      font-size: 46px;
      color: #7a8ca1;
    }
    .iconweixin,
    .iconzhifubao {
      display: inline-block;
      font-size: 46px;
      margin-right: 16px;
      vertical-align: middle;
    }
    &.active {
      display: inline-block;
      height: 352px;
      .logo-wrap {
        margin-top: 10px;
      }
      .iconpaypalcolor {
        font-size: 30px;
        color: #419bd8;
      }
      .iconweixin,
      .iconzhifubao {
        font-size: 30px;
      }
      .iconweixin {
        color: #6dd401;
      }
      .iconzhifubao {
        color: #439fe3;
      }
      .wx {
        font-size: 20px;
        color: #6dd401;
      }
      .alipay {
        font-size: 20px;
        color: #439fe3;
      }
    }
  }
}
</style>
