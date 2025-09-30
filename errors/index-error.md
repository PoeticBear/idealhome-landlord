index.js:978 Error: Module build failed (from ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js):
SassError: expected "}".
     ╷
1054 │         }
     │          ^
     ╵
  D:\Developer\idealhome-landlord\pages\index\index.vue 1054:4  root stylesheet
    at Object.z4Gi (pages-index-index.js:1004:7)
    at __webpack_require__ (index.js:854:30)
    at fn (index.js:151:20)
    at Object.qgLq (pages-index-index.js:935:15)
    at __webpack_require__ (index.js:854:30)
    at fn (index.js:151:20)
    at 6s2C (pages-index-index.js:12:1149)
    at __webpack_require__ (index.js:854:30)
    at fn (index.js:151:20)
    at eval (v1H8:5:126)


    chunk-vendors.js:25002 [Vue warn]: Failed to resolve async component: function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-index-index */[__webpack_require__.e("house_pages-house-add~house_pages-house-leaseApplication~house_pages-house-maintenanceList~pages-ind~0f8ac1f1"), __webpack_require__.e("house_pages-house-add~house_pages-house-leaseApplication~house_pages-house-maintenanceList~pages-ind~b34dee68"), __webpack_require__.e("house_pages-house-add~house_pages-house-maintenanceList~pages-index-index~pages-user-user~tenants_pa~bbd85aa3"), __webpack_require__.e("house_pages-house-leaseApplication~house_pages-house-maintenanceList~pages-index-index~tenants_pages~b4f592c6"), __webpack_require__.e("house_pages-house-maintenanceList~pages-index-index~tenants_pages-tenants-list"), __webpack_require__.e("house_pages-house-add~pages-index-index"), __webpack_require__.e("pages-index-index")]).then((function () {
      return resolve(__webpack_require__(/*! D:/Developer/idealhome-landlord/pages/index/index.vue */ "v1H8"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
}
Reason: Error: Module build failed (from ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js):
SassError: expected "}".
     ╷
1054 │         }
     │          ^
     ╵
  D:\Developer\idealhome-landlord\pages\index\index.vue 1054:4  root stylesheet