import { AvailableRevokeFrontendAction } from './availableType';
/**
 * 
 * No 's' Even when it supports multiple actions in one action
 * Its always to have more data than less.
 */

// This is the api version
export type EventType = EventHeader
/**
 * <HEAD>
 * 리퀘스트를 할 때 이벤트 해더를 보낸다. 이러이러한 이벤트를 이벤트 버스에 던진다 (Throw an event)
 * 리퀘스트는 기본적으로 이벤트 이름과 버젼, 이벤트 받는이와 After action이 담긴다.
 * After action같은 경우에는 상대가 읽을 수 있게 만들게 하기 위한 좋은 시스템!
 * HEAD는 심플하게 리퀘스터가 보내는 정보를 갖고 있다.
 * 
 * <TAIL>
 * 테일은 중요한 정보를 포함하므로 Response로 보내지 않고 로그로만 보낸다. 
 * 이벤트가 API 게이트 웨이에 도착하면 프로세스를 시작한다.
 * Wambda를 콜할수도 있고 DB도 접속하고 등등 필요한 처리를 한다.
 * 처리를 하면서 이 Request를 보낸 사람의 wrn, 받는이의 wrn
 * 처리 시작하기 시작한 시간. 이벤트 아이디. 이벤트 소스 아이피 이벤트 국가 등
 * 이벤트를 거부하거나 동의하기 전에 먼저 기본적인 정보를 이벤트 테일에 저장한다.
 * 테일이지만 2번째에 저장된다는게 포인트인 거 같다.
 * 
 * <BODY>
 * 바디는 보내는 데이터이므로 공개 데이터여야만 한다.
 * 자이제 처리가 끝나면 이벤트 바디가 생성된다.
 * 거부했는지 성공했는지 등이 나오고
 * 똑같이 페일로드를 보낸다.
 * 이 페일로드를 보내기 전에 이벤트 로그를 그대로 DB에 저장한다.
 * 이를 통해 아래의 결과가 나타난다
 */

/**

{
  eventFormVersion: "1.0"
  eventHead: {
    eventName: "RequestRefreshtokenThroughGoogle",
    eventVersion: "1.0",
    eventRequesterUserPublicId: null,
    eventReceiverUserPublicId: null
    payload: any
  },
  eventBody: {
    eventResult: 'allow' | 'deny',
    eventSecurityCriticality: 'low' | 'medium' | 'high' | 'very high'
    eventTimestamp: 8371392727523450
    revokeFrontendActionType: null,
    payload: any
  },
  eventTail: {
    eventRequesterUserWrn: "wrn::user:admin:00000000:6250655368566D597133743677397A24" // Alright this is random so okay?
    eventReceiverUserWrn: "wrn::user:admin:00000000:3878214125442A472D4B615064536756" // Alright this is random so okay?
    sourceIpAddress: "14.35.214.111",
    sourceIpCountry: "Japan",
    sourceMacAddress: "AC:51:3F:5S:1A",
  }
}
 */


export type EventHeader = {
  eventName: string;
  eventVersion: string;
  /**
   * 'eventReceivingUserPublicId' is the target for receving this event
   * if it is null, then it means it is doing its work to itself (self call)
   * If it is other public id, then it can be called as well.
   */
  eventReceivingUserPublicId: null | string;
  /**
   * 'revokeFrontendActionType' is a list of actions (or null) that is revoked for front-end to 
   * do after the request is sent back.
   */
  revokeFrontendActionType: null | AvailableRevokeFrontendAction[]; // if any revokation is required // 
  payload: any;
}


