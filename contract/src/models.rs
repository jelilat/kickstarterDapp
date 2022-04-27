use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
    #[allow(unused_imports)]
    use near_sdk::{env, near_bindgen};
    use near_sdk::serde::{Deserialize, Serialize};
    
    use crate::utils::{
        AccountId,
        Money,
        Timestamp
    };

    #[derive(Clone, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
    #[serde(crate = "near_sdk::serde")]
    pub struct Campaign{
      pub id: i32,
      pub creator: AccountId,
      pub created_at: Timestamp,
      pub title: String,
      pub donation_target: u128,
      pub total_donations: u128,
      pub total_votes: i64,
      pub description: String,
      pub votes: Vec<String>,
      pub donations: Vec<Donation>,
      pub image: String,
    }
    
    impl Campaign{
        pub fn new(id:i32, title: String, donation_target:u128, description: String, image: String) -> Self {
            
            Campaign{
                id,
                creator: env::signer_account_id(),
                created_at: env::block_timestamp(),
                title,
                donation_target,
                total_donations: 0,
                total_votes : 0,
                description,
                votes: vec![],
                donations: vec![],
                image,
            }
        }
    }

    #[derive(Clone, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
    #[serde(crate = "near_sdk::serde")]
    pub struct Donation {
        amount: Money,
        donor: AccountId,
        campaign_id: i32,
    }
    impl Donation {
        pub fn new(id: i32) -> Self {        
          Donation{
            amount: env::attached_deposit(),
            donor: env::predecessor_account_id(),
            campaign_id: id,
            }
        }  
    }