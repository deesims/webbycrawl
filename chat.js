//Senbird
var appId = '';
var userId =  '';
var currentChannel = '';
var sb = new SendBird({
      appId: appId
});
setAllEventHandlers();

function setAllEventHandlers(){
      var ChannelHandler = new sb.ChannelHandler();
      ChannelHandler.onMessageReceived = function(channel, message){
           console.log("message::Received;");
          appendMessageToUI(channel, 'left');
          console.log(channel, message);
      };
      ChannelHandler.onUserEntered = function (openChannel, user) {
            console.log("New user has entered the channel.");
            console.log("user::" + user.userId);
            console.log("channel::" + openChannel);
      };
      sb.addChannelHandler('GLOBAL_HANDLER', ChannelHandler);
}

function getArrayOfAllChannels(){
      sb.connect(userId, function(user, error){
            var openChannelListQuery = sb.OpenChannel.createOpenChannelListQuery();
            openChannelListQuery.next(function (channels, error) {
                if (error) {
                    console.log(error);
                    return;
                }
                console.log(channels);

                for(curChannel=0; curChannel < channels.length; curChannel++){
                      $('#channel-results').append(`
                      <tr>
                            <td><a href="#"
                            id=`+channels[curChannel].url+`
                            class="channel-link"
                            onclick="enterChannel('`+channels[curChannel].url+`')">
                            `+channels[curChannel].url+`
                            </a>
                            </td>
                            <td>`+channels[curChannel].participantCount+`</td>
                      </tr>`);
                }
            });
      });
}

function getMembersOfChannel(channel){
      var participantListQuery = channel.createParticipantListQuery();
       participantListQuery.next(function (participantList, error){
           if (error) {
              console.error(error);
              return;
           }
       });
}

function refreshMessages(channel){
      var messageListQuery = channel.createPreviousMessageListQuery();
      messageListQuery.load(30, true, function(messageList, error){
         if (error) {
              console.error(error);
              return;
         }
         console.log(messageList);
         console.log("current user::" + userId)

         for(order=messageList.length-1; order >= 0; order--){
              if (messageList[order].sender.userId == userId){
                    $('#chatbox-results').append(`
                    <div class="chatbox__body__message chatbox__body__message--right">
                        <img src='`+messageList[order].sender.profileUrl+`' alt="Picture">
                        <p>`+messageList[order].message+`</p>
                    </div>`)
              } else {
                    $('#chatbox-results').append(`
                    <div class="chatbox__body__message chatbox__body__message--left">
                        <img src='`+messageList[order].sender.profileUrl+`' alt="Picture">
                        <p>`+messageList[order].message+`</p>
                    </div>`)
              }
         }
      });
}

function appendMessageToUI(channel, alignment){
      var messageListQuery = channel.createPreviousMessageListQuery();
      messageListQuery.load(1, true, function(messageList, error){
         if (error) {
              console.error(error);
              return;
         }
         console.log(messageList);

         for(order=0; order < messageList.length; order++){
                    $('#chatbox-results').append(`
                    <div class="chatbox__body__message chatbox__body__message--`+alignment+`">
                        <img src='`+messageList[order].sender.profileUrl+`' alt="Picture">
                        <p>`+messageList[order].message+`</p>
          </div>`);}
      });
}

function createChannel(){
      var name = $('#inputName').val();
      console.log("createChannel::name::"+name);
      var coverUrl = name;
      sb.OpenChannel.createChannel(name, coverUrl, null, function(createdChannel, error) {
          if (error) {
              console.error(error);
              return;
          }
          // onCreated
          console.log(createdChannel);
          enterChannel(createdChannel.url);
      });
}

function enterChannel(channelUrl){
      sb.connect(userId, function(user, error) {
          console.log("Welcome: " + user);
          sb.OpenChannel.getChannel(channelUrl, function (channel, error) {
             if (error) {
                 console.error(error);
                 return;
             }
             channel.enter(function(response, error){
                 if (error) {
                    console.error(error);
                    return;
                 }
                 currentChannel = channelUrl;
                 var $chatbox = $('.chatbox');
                 $chatbox.removeClass('chatbox--empty');
                 refreshMessages(channel);
             });
          });
      });
}

function sendChatMessage(channelUrl){
      sb.connect(userId, function(user, error) {
          console.log("Welcome: " + user);
          sb.OpenChannel.getChannel(channelUrl, function (channel, error) {
             if (error) {
                 console.error(error);
                 return;
             }
             channel.enter(function(response, error){
                 if (error) {
                    console.error(error);
                    return;
                 }
                 var message = $('#chatbox-input').val();
                 $('#chatbox-input').val('');
                 var jsonData = {};
                 channel.sendUserMessage(message, jsonData, 'testing', function(message, error){
                       if (error) {
                           console.error(error);
                           return;
                       }
                       // onSent
                       console.log(message);
                       appendMessageToUI(channel, 'right');
                     });
             });
          });
      });
}
