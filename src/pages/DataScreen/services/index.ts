import axios from "axios"

export const getGeoJsonall = (code: string) => {
    return new Promise((resolve, inject) => {
      axios.get(`https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${code}`).then((res) => {
        if (res.data.features) {
          resolve(res)
        } else {
          inject(res)
        }
      })
    })
}
