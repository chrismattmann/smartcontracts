const FundraiserContract = artifacts.require("Fundraiser");

contract("Fundraiser", accounts => {

    let fundraiser;
    const name = "Beneficiary Name";
    const url = "benefciaryname.org";
    const imageUrl = "https://placekitten.com/600/350";
    const description = "Beneficiary description";

    describe("initialization", ()=>{
	beforeEach(async () => {
            fundraiser = await FundraiserContract.new(
		name,
	        url,
	        imageUrl,
	        description
	    );
	});


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

    });

});
