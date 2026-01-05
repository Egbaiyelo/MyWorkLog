import { vi, describe, it, expect, beforeEach } from 'vitest';
import { chrome } from 'jest-chrome'; 
import { addSite } from '../extension/files/sitelog';

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