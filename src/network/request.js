import axios from 'axios'

export function request(config) {
    //  1.创建axios的实例
    const instance = axios.create({
      baseURL: 'http://152.136.185.210:8000/api/w6',
      timeout: 5000
    })

    // 2.0.axios的拦截器： 请求拦截的作用
    instance.interceptors.request.use(config => {
      return config
    }, err => {
      // console.log(err);
      return err
    });

    // 2.1.响应拦截
    instance.interceptors.response.use(response => {
      // console.log(res);
      return response.data
    }, err => {
      console.log('来到了res拦截failure中');
      // console.log(err.response)
      if (err && err.response) {
        switch(err && err.response.status){
          case 400:
            err.message = '请求错误'
            break
          case 401:
            err.message = '未授权的访问'
            break
        }
      }
      return err
    })

    // 3.发送真正的网络请求
    return instance(config);
    // 本身就是promise
}

