const region = 'ap-northeast-1';
const userpoolid = 'ap-northeast-1_yzp8Pc7lw';
const clientid = '23hr2dl6lva2ot5cl1r2j7akf4';


function callCognito() {
  document.getElementById('result').value = "";
  $('#message').empty();

  const username = document.getElementById('idTxt').value;
  const password = document.getElementById('pwTxt').value;

  const authenticationData = {
       Username : username,
       Password : password,
   };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  const poolData = {
     UserPoolId : userpoolid,
     ClientId : clientid
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  const userData = {
     Username : username,
     Pool : userPool
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) { // 認証成功時の処理
       let accessToken = result.getAccessToken().getJwtToken();
       console.log(JSON.stringify(result));
       let idToken = result.idToken.jwtToken;
       console.log(idToken);
       $('#result').val(idToken);
    },

    onFailure: function(err) { // エラー発生時の処理
       console.log(JSON.stringify(err));
       $('#message').append(JSON.stringify(err));
    },

    newPasswordRequired: function(userAttributes, requiredAttributes) { // パスワード変更が必要なユーザーの、パスワードを強制変更
       cognitoUser.completeNewPasswordChallenge("test9999", {}, this)
       $('#message').append("パスワード変更が必要なユーザーのため、パスワードを「test9999」に変更しました\n");
    }
  });
}
