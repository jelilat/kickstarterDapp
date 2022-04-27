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
        Campaign,
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
    campaigns: Vec<Campaign>,
    donations: Vec<Donation>,
}

#[near_bindgen]
impl Contract{
    #[init]
    pub fn init(
        owner: AccountId,
    ) -> Self{
        let campaigns: Vec<Campaign> = Vec::new();
        let donations: Vec<Donation> = Vec::new();

        Contract{
            owner,
            campaigns,
            donations
        }
    }

    pub fn add_campaign(&mut self, title: String, donation_target: u128, description: String, image: String) -> i32 {
            
        let id = self.campaigns.len() as i32;
        
        self.campaigns.push(Campaign::new(
            id,
            title,
            donation_target,
            description,
            image
        ));
        env::log("Added a new campaign".as_bytes());
        return id
    }

    pub fn list_campaigns(&self) -> Vec<Campaign> {
        let campaigns = &self.campaigns;
        return campaigns.to_vec();
    }

    pub fn add_vote(&mut self, num_id:i32){
        let id: usize = num_id as usize;
        let campaign: &mut Campaign = self.campaigns.get_mut(id).unwrap();
        let voter = env::predecessor_account_id();
        campaign.total_votes = campaign.total_votes + 1;
        env::log("vote submitted succesfully".as_bytes());
        campaign.votes.push(voter);
        
    }

    pub fn add_donation(&mut self, num_id:i32, amount:u128) {
        assert!(amount == env::attached_deposit(), "Attached deposit must be equal to the donation amount");
        let id: usize = num_id as usize;
        let transfer_amount: u128 = ONE_NEAR * amount;
        let campaign: &mut Campaign = self.campaigns.get_mut(id).unwrap();
        campaign.total_donations = campaign.total_donations + transfer_amount;
        campaign.donations.push(Donation::new(num_id));
        self.donations.push(Donation::new(num_id));

       //TODO: ensure that amount == env::attached_deposit()
       Promise::new(env::predecessor_account_id()).transfer(transfer_amount);
      env::log("You have donated succesfully".as_bytes());
    }

    pub fn campaign_count(&self) -> usize {
        return self.campaigns.len();
    }

    pub fn get_total_donations(&self, num_id:i32) -> u128 {
        let id: usize = num_id as usize;
        let campaign: &Campaign = self.campaigns.get(id).unwrap();
        return campaign.total_donations;
    }

    pub fn get_total_votes(&self, num_id:i32) -> i64 {
        let id: usize = num_id as usize;
        let campaign: &Campaign = self.campaigns.get(id).unwrap();
        return campaign.total_votes;
    }

    pub fn get_donations(&self, num_id:i32) -> Vec<Donation> {
        let id: usize = num_id as usize;
        let campaign: &Campaign = self.campaigns.get(id).unwrap();
        return campaign.donations.to_vec();
    }

    pub fn get_campaign_details(&self, num_id:i32) -> Campaign {
        let id: usize = num_id as usize;
        let campaign: &Campaign = self.campaigns.get(id).unwrap();
        return campaign.clone();
    }
}