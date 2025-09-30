chunk-vendors.js:25002 [Vue warn]: Property or method "goToLogin" is not defined on the instance but referenced during render. Make sure that this property is reactive, either in the data option, or for class-based components, by initializing the property. See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.

found in

---> at pages/index/index.vue

chunk-vendors.js:25002 [Vue warn]: Error in v-on handler: "TypeError: Cannot read properties of undefined (reading 'apply')"

found in

---> <UButton> at uni_modules/uview-ui/components/u-button/u-button.vue
       at :8080/pages/index/index.vue


chunk-vendors.js:23941 [system] TypeError: Cannot read properties of undefined (reading 'apply')
    at click (pages-index-index.js:446:43)
    at invokeWithErrorHandling (chunk-vendors.js:26245:26)
    at VueComponent.invoker (chunk-vendors.js:26570:14)
    at invokeWithErrorHandling (chunk-vendors.js:26245:26)
    at Vue.$emit (chunk-vendors.js:28314:9)
    at eval (u-button.vue:269:1)
    at Object.throttle (throttle.js:16:43)
    at VueComponent.clickHandler (u-button.vue:268:1)
    at click (house_pages-house-add~house_pages-house-leaseApplication~house_pages-house-maintenanceList~pages-ind~b34dee68.js:365:28)
    at invokeWithErrorHandling (chunk-vendors.js:26245:26)