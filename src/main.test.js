beforeAll(async function () {
  // NOTE: nearlib and nearConfig are made available by near-cli/test_environment
  const near = await nearlib.connect(nearConfig)
  window.accountId = nearConfig.contractName
  window.contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ['list_crowdfunds', 'crowdfund_count', 'get_total_donations', 'get_total_votes', 'get_donations', 'get_crowdfund_details'],
    changeMethods: ['add_crowdfund', 'add_vote', 'add_donation'],
    sender: window.accountId
  })

  window.walletConnection = {
    requestSignIn() {
    },
    signOut() {
    },
    isSignedIn() {
      return true
    },
    getAccountId() {
      return window.accountId
    }
  }
})

test('get_greeting', async () => {
  const message = await window.contract.get_greeting({ account_id: window.accountId })
  expect(message).toEqual('Hello')
})
