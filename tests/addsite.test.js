import { vi, describe, it, expect, beforeEach } from 'vitest';
import { addSite } from '../extension/files/sitelog';
import { before } from 'node:test';

//- need a solution for this later, jest is not implied without this
if (typeof global.jest === 'undefined') {
  global.jest = vi;
}

describe('addSite logic', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        delete window.location;
        window.location = new URL('https://bmo.wd3.myworkdayjobs.com/en-US/External/userHome');
    });

    it('should extract company name and baseURL correctly', () => {
        chrome.storage.local.get.mockImplementation((key, callback) => {
            callback({});
        });

        addSite();

        expect(chrome.storage.local.set).toHaveBeenCalledWith({
            companySites: {
                bmo: 'https://bmo.wd3.myworkdayjobs.com/en-US/External'
            }
        }, expect.any(Function));
    });

    // Only for native messenger
    it('should send "addSite" message if company is new', () => {
        chrome.storage.local.get.mockImplementation((key, callback) => {
            callback({});
        });

        addSite();

        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
            action: "addSite",
            data: {
                companyName: 'bmo',
                url: 'https://bmo.wd3.myworkdayjobs.com/en-US/External'
            }
        });
    });

    it('should send "siteChange" message if the URL has changed for an existing site', () => {
        chrome.storage.local.get.mockImplementation((key, callback) => {
            callback({
                companySites: { bmo: 'https://old-link.com' }
            });
        });

        addSite();

        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
            action: "siteChange",
            data: expect.objectContaining({
                companyName: 'bmo',
                oldUrl: 'https://old-link.com'
            })
        });
    });

});

describe('addsite test on multiple urls', () => {
    beforeEach( () => {
        vi.clearAllMocks();
    });

    //- leads to another issue if the site isnt moved to source /userHome (force site change when it does)
    it.each([
        //- note to ensure all sites have the link to /userHome and that it doesnt just take a random link
        {
            url: 'https://globalcorp.wd3.myworkdayjobs.com/en-US/External',
            expectedName: 'globalcorp'
        },
        {
            url: 'https://octan.wd3.myworkdayjobs.com/en-US/octan_Bank_Careers',
            expectedName: 'octan'
        }
    ])('should handle each site correctly', ({url, expectedName}) => {
    
        delete window.location;
        window.location = new URL(url);
    
        chrome.storage.local.get.mockImplementation((key, callback) => {
            callback({});
        });
    
        addSite();

        //- test expected base ending
        // const expectedBaseEnding = ""
    
        expect(chrome.storage.local.set).toHaveBeenCalledWith(
            expect.objectContaining({
                companySites: expect.objectContaining({
                    // or expect.stringContaining
                    [expectedName]: expect.stringContaining(expectedName)
                })
            }), expect.any(Function)
        )
    
    });
})