/**
 * 
 * 
 */

const patch1_1 = {
  date: 'Sep 12, 2020',
  name: 'Apricot',
  version: '1.1',
  contents: [
    {
      title: 'Now it supports HTTPS connection!',
      explain: 'Following the industry standards for secured transfer of personal data'
    }
  ],
  philosophy: [
    `1. 제공하는 서비스를 통해 사용자들의 삶의 질을 높히고, 
    더욱 더 자랑스러운 삶에 기여한다 (멋진 서비스) (Inspired by Tony Robbins)`,
    `2. 사용자들이 이 서비스를 이용한다는 그 이유 하나만으로 
    자신의 전문 분야에 집중하면서도 모국어가 아닌 언어를 배울 수 있는 편리한 
    서비스를 제공한다 (편리한 서비스) (Inpired by Myself)`,
    `3. 사용자들의 소중한 개인정보를 다중으로 보호한다. (프라이버시) (Inspired by Apple Inc.)`
  ]
}

 const patch1_0 = {
    date: 'Sep 10, 2020',
    name: 'Apricot',
    version: '1.0',
    contents: [
      {
        title: 'First publish to the online',
        explain: 'The journey has just started!'
      }
    ]
 }

 const patch1List = [patch1_1, patch1_0];

 export default patch1List;

