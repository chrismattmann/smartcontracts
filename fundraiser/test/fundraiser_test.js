const FundraiserContract = artifacts.require("Fundraiser");

contract("Fundraiser", accounts => {
    let fundraiser;
    const name = "Beneficiary Name";
    const url = "benefciaryname.org";
    const imageUrl = "https://placekitten.com/600/350";
    const description = "Beneficiary description";
    const beneficiary = accounts[1];
    const owner = accounts[0];


    beforeEach(async () => {
	fundraiser = await FundraiserContract.new(
		name,
	        url,
	        imageUrl,
	        description,
		beneficiary,
		owner
	    );
    });    
    
    describe("initialization", ()=>{



	it("gets the beneficiary name", async () => {
		const actual = await fundraiser.name();
		assert.equal(actual, name, "names should match.");
	});

	it("gets the beneficiary url", async() => {
	    const actual = await fundraiser.url();
            assert.equal(actual, url, "url should match.");
	});

	it("gets the beneficiary image url", async() => {
            const actual = await fundraiser.imageUrl();
	    assert.equal(actual, imageUrl, "imageUrl should match.");
	});

	it("gets the beneficiary description", async() => {
            const actual = await fundraiser.description();
	    assert.equal(actual, description, "description should match.");
	});

	it("gets the beneficiary", async() => {
            const actual = await fundraiser.beneficiary();
	    assert.equal(actual, beneficiary, "beneficiary should match.");
	});

	it("gets the owner", async() => {
            const actual = await fundraiser.owner();
	    assert.equal(actual, owner, "owner should match.");
	});

    });


    describe("setBeneficiary", () => {
	const newBeneficiary = accounts[2];

	it("updated beneficiary when called by owner account", async () => {
            await fundraiser.setBeneficiary(newBeneficiary, {from:owner});
	    const actualBeneficiary = await fundraiser.beneficiary();
	    assert.equal(actualBeneficiary, newBeneficiary, "beneficiaries should match.");
	});

	it("throws an error when called from a non-owner account", async() => {
            try{
		await fundraiser.setBeneficiary(newBeneficiary, {from:accounts[3]});
		assert.fail("withdraw was not restricted to owners");
	    } catch(err) {
                const expectedError = "Ownable: caller is not the owner";
		const actualError = err.reason;
		assert.equal(actualError, expectedError, "should not be permitted.");
	    }
	    
	});
    });

    describe("making donations", () => {
        const value = web3.utils.toWei('0.0289');
	const donor = accounts[2];

	it("increases myDonationsCount", async () => {
            const currentDonationsCount = await fundraiser.myDonationsCount(
		{from: donor}
	    );

	    await fundraiser.donate({from: donor, value});

	    const newDonationsCount = await fundraiser.myDonationsCount(
		{from: donor}
	    );
	    
	    assert.equal(1,
			 newDonationsCount - currentDonationsCount,
			 "myDonationsCount should increment by 1");
	    
	});


	it("includes donation in myDonations", async() => {
            await fundraiser.donate({from: donor, value});
	    const {values, dates} = await fundraiser.myDonations(
		{from:donor}
	    );

	    assert.equal(
		value,
		values[0],
		"values should match.")

	    assert(dates[0], "date should be present.");
	});

	it("increases the totalDonations amount", async() => {
            const currentTotalDonations = await fundraiser.totalDonations();
	    await fundraiser.donate({from: donor, value});
	    const newTotalDonations = await fundraiser.totalDonations();

	    const diff = newTotalDonations - currentTotalDonations;

	    assert.equal(
		diff,
		value,
		"difference should match the donation value."
	    );

	});

	it("increases the donationsCount", async() => {
            const currentDonationsCount = await fundraiser.donationsCount();
	    await fundraiser.donate({from: donor, value});
	    const newDonationsCount = await fundraiser.donationsCount();

	    assert.equal(1,
			 newDonationsCount - currentDonationsCount,
			 "donationsCount should increment by 1");

	});

    });
});
