mod models;
mod utils;
use crate::{
    utils::{
        AccountId,
        ONE_NEAR,
        assert_self,
        assert_single_promise_success,
    },
    models::{
        Crowdfund,
        Donation
    }
};

// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::{borsh::{self, BorshDeserialize, BorshSerialize}, Promise};
#[allow(unused_imports)]
use near_sdk::{env, PromiseIndex, near_bindgen};
near_sdk::setup_alloc!();  

#[near_bindgen]
#[derive(Clone, Default, BorshDeserialize, BorshSerialize)]
pub struct Contract {
    owner: AccountId,
    crowdfunds: Vec<Crowdfund>,
    donations: Vec<Donation>,
}

#[near_bindgen]
impl Contract{
    #[init]
    pub fn init(
        owner: AccountId,
    ) -> Self{
        let crowdfunds: Vec<Crowdfund> = Vec::new();
        let donations: Vec<Donation> = Vec::new();

        Contract{
            owner,
            crowdfunds,
            donations
        }
    }

    pub fn add_crowdfund(&mut self, title: String, donation_target: u128, description: String, image: String) -> i32 {
            
        let id = self.crowdfunds.len() as i32;
        
        self.crowdfunds.push(Crowdfund::new(
            id,
            title,
            donation_target,
            description,
            image
        ));
        env::log("Added a new crowdfund".as_bytes());
        return id
    }

    pub fn list_crowdfunds(&self) -> Vec<Crowdfund> {
        assert_self();
        let crowdfunds = &self.crowdfunds;
        return crowdfunds.to_vec();
    }

    pub fn add_vote(&mut self, num_id:i32){
        let id: usize = num_id as usize;
        let crowdfund: &mut Crowdfund = self.crowdfunds.get_mut(id).unwrap();
        let voter = env::predecessor_account_id();
        crowdfund.total_votes = crowdfund.total_votes + 1;
        env::log("vote submitted succesfully".as_bytes());
        crowdfund.votes.push(voter);
        
    }

    pub fn add_donation(&mut self, num_id:i32, amount:u128) {
        assert!(amount == env::attached_deposit(), "Attached deposit must be equal to the donation amount");
        let id: usize = num_id as usize;
        let transfer_amount: u128 = ONE_NEAR * amount;
        let crowdfund: &mut Crowdfund = self.crowdfunds.get_mut(id).unwrap();
        crowdfund.total_donations = crowdfund.total_donations + transfer_amount;
        crowdfund.donations.push(Donation::new(num_id));
        self.donations.push(Donation::new(num_id));

       //TODO: ensure that amount == env::attached_deposit()
       Promise::new(env::predecessor_account_id()).transfer(transfer_amount);
      env::log("You have donated succesfully".as_bytes());
    }

    pub fn crowdfund_count(&mut self) -> usize {
        return self.crowdfunds.len();
    }

    pub fn get_total_donations(&mut self, num_id:i32) -> u128 {
        let id: usize = num_id as usize;
        let crowdfund: &mut Crowdfund = self.crowdfunds.get_mut(id).unwrap();
        return crowdfund.total_donations;
    }

    pub fn get_total_votes(&mut self, num_id:i32) -> i64 {
        let id: usize = num_id as usize;
        let crowdfund: &mut Crowdfund = self.crowdfunds.get_mut(id).unwrap();
        return crowdfund.total_votes;
    }

    pub fn get_donations(&mut self, num_id:i32) -> Vec<Donation> {
        let id: usize = num_id as usize;
        let crowdfund: &mut Crowdfund = self.crowdfunds.get_mut(id).unwrap();
        return crowdfund.donations.to_vec();
    }

    pub fn get_crowdfund_details(&mut self, num_id:i32) -> Crowdfund {
        let id: usize = num_id as usize;
        let crowdfund: &mut Crowdfund = self.crowdfunds.get_mut(id).unwrap();
        return crowdfund.clone();
    }
}