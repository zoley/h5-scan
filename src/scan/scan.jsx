import './scan.css'
import { useEffect, useState } from 'react'
import { BrowserMultiFormatReader } from "@zxing/library"


export const Scan = () => {
  const [errMssage, setErrMessage] = useState('')
  const [reader, setReader] = useState(null)
  const [devicedId, setDevicedId] = useState(null)
  const [begin, setBegin] = useState(false)
  const initReader = async () => {
    const codeReader = new BrowserMultiFormatReader()
    try {
      const videoInputDevices = await codeReader.listVideoInputDevices()
      console.log('摄像头设备videoInputDevices:', videoInputDevices)
      videoInputDevices.forEach((device) => console.log(`${device.label}, ${device.deviceId}`)
      )
      if (videoInputDevices.length < 1) {
        setErrMessage('没有检测到可用的摄像头')
      } else {
        setErrMessage('')
      }
      return {
        codeReader,
        firstDevicedId: videoInputDevices[0]?.deviceId
      }
    } catch (err) {
      console.log(err)
    }
  }

  const decode = (codeReader, selectDevicedId) => {
    if(begin)return
    setBegin(true)
    codeReader.decodeFromInputVideoDevice(selectDevicedId, 'video').then(result => {
      console.log(result)
      let text = result.text
      window.location.href = text
    }).catch(err => {
      setErrMessage(err || '二维码识别失败')
    })
  }

  useEffect(() => {
    (async () => {
      if (!reader) {
        const { codeReader, firstDevicedId } = await initReader()
        setReader(codeReader)
        setDevicedId(firstDevicedId)
      }
    })()
  }, [reader])

  return <>
    <header className="title">请扫描二维码</header>
    <div className="scan-wrap">
      <div className="scan-box">         
        <div className={begin?'line begin':'line'}></div>
        <div className="angle"></div>
      </div>
      <video id="video" width="250" height="250" style={{border: '1px solid #ddd',objectFit:'cover'}} />
    </div>
    <div style={{ color: '#f00', fontSize: '14px', height: '30px', textAlign: 'center', marginTop: '10px', padding: '0 10px' }}>{errMssage}</div>
    <button className='btn' onClick={()=>decode(reader,devicedId)}>点击进行扫码</button>
  </>
}