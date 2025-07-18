# Change history for ui-data-import

## [9.1.0] (IN PROGRESS)

### Features added:
* Action profile: limit the list of linkable field mapping profiles based on FOLIO record type (UIDATIMP-1328)
* Add "LCCN" accepted value for Product ID in Orders Field Mapping Profiles. (UIDATIMP-2737)
* Display correctly file names with multinumber strings followed by `-`. (UIDATIMP-1729)
* Hide `Default - Create Holdings and SRS MARC Holdings` job profile from Data import app on Central tenant. (UIDATIMP-1733)

### Bugs fixed:
* Place wrappers in right order to not lose any data after applying `flow()`. (UIDATIMP-1716)
* Fix stuck Progress Bar in import files. (UIDATIMP-1725)

## [9.0.0](https://github.com/folio-org/ui-data-import/tree/v9.0.0) (2025-03-13)

### Features added:
* `React v19`: refactor away from default props for functional components. (UIDATIMP-1634)
* Add `required: true` to contributor and vendorDetail fields to the Order Mapping Profile. (UIDATIMP-1709)
* *BREAKING* Migrate stripes dependencies to their Sunflower versions. (UIDATIMP-1705)
* *BREAKING* Migrate `react-intl` to v7. (UIDATIMP-1706)
* CI: Switch to centralized/shared workflow. (UIDATIMP-1704)
* Apply wrappers with `flow()` instead of annotations. (UIDATIMP-1712)
* Make TextDate.test.js robust to March, 2025 (UIDATIMP-1715)

## [8.0.5](https://github.com/folio-org/ui-data-import/tree/v8.0.5) (2024-12-19)

### Bugs fixed:
* Trigger file selection window to open after click `Choose other files to upload` button. (UIDATIMP-1683)
* Fixed progress bar goes above 100% when job is stuck in running column. (UIDATIMP-1691)

## [8.0.4](https://github.com/folio-org/ui-data-import/tree/v8.0.4) (2024-12-06)

### Bugs fixed:
* Allow central tenant to create filed mapping profile for Orders and Invoices. (UIDATIMP-1685)
* Populate "Existing records" field when create match profile. (UIDATIMP-1689)

## [8.0.3](https://github.com/folio-org/ui-data-import/tree/v8.0.3) (2024-12-04)

### Bugs fixed:
* Allow central tenant to create action profile for Orders and Invoices. (UIDATIMP-1679)
* Replace `_/proxy/tenants/${tenant}/modules` with `stripes.discovery.modules` object. (UIDATIMP-1686)

## [8.0.2](https://github.com/folio-org/ui-data-import/tree/v8.0.2) (2024-11-21)

### Bugs fixed:
* Display placeholder in `Job profile` and `User` filters on the `View all` page after clicking on `Reset all` button. (UIDATIMP-1675)

## [8.0.1](https://github.com/folio-org/ui-data-import/tree/v8.0.1) (2024-11-15)

### Bugs fixed:
* Invoice field mapping profile: cannot check export to accounting checkbox. (UIDATIMP-1671)

## [8.0.0](https://github.com/folio-org/ui-data-import/tree/v8.0.0) (2024-10-31)

### Features added:
* Fix unit tests warnings in console. (UIDATIMP-1606)
* Wrap value for "distributionType" field mapping with quotation marks (UIDATIMP-1644)
* Remove steps with BigTest check from pipelines on Jenkins (UIDATIMP-1648)
* Replace `useTenantKy` with `useOkapiKy` (UIDATIMP-1649)
* Transform `ViewAllLogs` component into the functional one (UIDATIMP-1630)
* Change endpoint to get actual SRS MARC data (UIDATIMP-1597)
* Implement new Donor information section for Order field mapping profiles (UIDATIMP-1656)
* Adjust value for invoice and invoice lines adjustments "Type" field mapping. (UIDATIMP-1662)
* Remove accepted values when Mapping profile is created/updated (Instance, Holding, Item and Order). (UIDATIMP-1663)
* Update 'Instance relationship' accordion name - Data Import Mapping (UIDATIMP-1670)
* BE permission refactoring. (UIDATIMP-1667)
* *BREAKING* Bump `stripes` to `v9.2.0` for Ramsons release. (UIDATIMP-1669)
* Exclude bulk edit job execution entries from data import log. (UIDATIMP-1665)
* Add "converter-storage.profileSnapshots.get" to "ui-data-import.manage" subPermissions. (UIDATIMP-1672)
* Bump "@folio/stripes-acq-components" version to v6.0.0. (UIDATIMP-1673)

### Bugs fixed:
* Remove `selected` column from associated profiles list. (UIDATIMP-1607)
* Do not show "Leave the page" modal when view job profile from the list. (UIDATIMP-1615)
* When navigating to the Invoice field mapping profile edit form the page crashes (UIDATIMP-1646)
* Reset offset when open VievAllLogs page. (UIDATIMP-1645)
* Add missing `source-storage.sourceRecords.get` permission. (UIDATIMP-1652)
* Display correctly "Percentage" and "Currency" fields for orders and invoices. (UIDATIMP-1666)

## [7.1.12](https://github.com/folio-org/ui-data-import/tree/v7.1.12) (2025-02-06)

### Bugs fixed:
* Allow central tenant to create filed mapping profile for Orders and Invoices. (UIDATIMP-1700)
* Allow central tenant to create action profile for Orders and Invoices. (UIDATIMP-1701)

## [7.1.11](https://github.com/folio-org/ui-data-import/tree/v7.1.11) (2024-12-17)

### Bugs fixed
* Rename permission after refactoring request for getting SRS MARC data (UIDATIMP-1688)

## [7.1.10](https://github.com/folio-org/ui-data-import/tree/v7.1.10) (2024-11-12)

### Bugs fixed:
* Change endpoint to get actual SRS MARC data (UIDATIMP-1597)

## [7.1.9](https://github.com/folio-org/ui-data-import/tree/v7.1.9) (2024-09-16)

### Bugs fixed:
* Implement new Donor information section for Order field mapping profiles (UIDATIMP-1656)

## [7.1.8](https://github.com/folio-org/ui-data-import/tree/v7.1.8) (2024-05-09)

### Bugs fixed:
* Display an empty value when `jobProfileInfo` is empty. (UIDATIMP-1640)

## [7.1.7](https://github.com/folio-org/ui-data-import/tree/v7.1.7) (2024-05-09)

### Bugs fixed:
* Changes made during duplication of a job with a match profile are not saved. (UIDATIMP-1633)

## [7.1.6](https://github.com/folio-org/ui-data-import/tree/v7.1.6) (2024-05-02)

### Bugs fixed:
* Update Order mapping rules to allow Material Type mapping when Purchase Order Status set to 'Open'. (UIDATIMP-1627)

## [7.1.5](https://github.com/folio-org/ui-data-import/tree/v7.1.5) (2024-04-30)

### Bugs fixed:
* Changes made during duplication of "Default - Create SRS MARC Authority" job profile are not saved and affect original job profile. (UIDATIMP-1622)

## [7.1.4](https://github.com/folio-org/ui-data-import/tree/v7.1.4) (2024-04-26)

### Bugs fixed:
* The 'Error' status is not displayed in "Error" column for the same row as Items with status "No action". (UIDATIMP-1619)

## [7.1.3](https://github.com/folio-org/ui-data-import/tree/v7.1.3) (2024-04-22)

### Bugs fixed:
* "addedRelations" is not clearing after unlinking the update profile. (UIDATIMP-1603)

## [7.1.2](https://github.com/folio-org/ui-data-import/tree/v7.1.2) (2024-04-19)

### Bugs fixed:
* JSON log not displaying the location of created multiple holdings. (UIDATIMP-1608)
* Perform sorting by last name first, instead of first name in 'Updated by' column. (UIDATIMP-1613)
* Allow to search profiles using `*`. (UIDATIMP-1605)

## [7.1.1](https://github.com/folio-org/ui-data-import/tree/v7.1.1) (2024-04-11)

### Bugs fixed:
* Add permissions to data-import set to get incoming records. (UIDATIMP-1609)
* Trim lead numbers in `fileName` field for sorting when split files is enabled. (UIDATIMP-1604)

## [7.1.0](https://github.com/folio-org/ui-data-import/tree/v7.1.0) (2024-03-22)

### Features added:
* Action profile Settings: suppress checkboxes and checkbox actions. (UIDATIMP-1497)
* Field mapping profile Settings: suppress checkboxes and checkbox actions. (UIDATIMP-1498)
* Job profile Settings: suppress checkboxes and checkbox actions. (UIDATIMP-1495)
* Change path for holdingsRecord.json. (UIDATIMP-1576)
* Refactor CSS away from `color()` function. (UIDATIMP-1577)
* Match profile Settings: suppress checkboxes and checkbox actions. (UIDATIMP-1496)
* Display missed options in the 'Existing holdings record field' section after creating match profile. (UIDATIMP-1579)
* Update unit tests after changes in stripes-smart-components. (UIDATIMP-1585)
* Provide "accountNo" field mapping when account-level accounting code is specified for invoice mapping. (UIDATIMP-1584)
* Update unit tests after changes in stripes-smart-components. (UIDATIMP-1585)
* Mock ResizeObserver to fix failed tests. (UIDATIMP-1586)
* Make changes in requests for Log Details. (UIDATIMP-1558)
* Set Data Import settings HTML page title this format - `<<App name>> settings - <<selected page name>> - FOLIO` (UIDATIMP-1578)
* Reset checkboxes state after navigating away from the Home/View all logs page. (UIDATIMP-1593)
* Replace deprecated labelSingular prop with translations prop in MARCFieldProtection ControlledVocab. (UIDATIMP-1596)
* Remove MARC Bib option when Action = Create and update translation for "Create" option. (UIDATIMP-1598)
* View job logs: Use incomingRecordId to retrieve Incoming record logs. (UIDATIMP-1600)
* Bumped folio dependencies and interfaces dependency

### Bugs fixed:
* Set per-tenant limit to retrieve the data. (UIDATIMP-1566)
* Fix inconsistent behavior during editing job profiles (UIDATIMP-1530)
* Order field is nor populated during linking/unlinking profiles to job profile (UIDATIMP-1571)
* When error occurs during saving edited job profile page crashes (UIDATIMP-1572)
* Job summary: error column does not display errors (UIDATIMP-1590)
* Handle empty marc mapping label (UIDATIMP-1592)
* Update style of Incoming Record button to match other buttons (UIDATIMP-1594)
* Not able to use system generated Match profiles (UIDATIMP-1521)
* Change error message when upload definition has been deleted by another user. (UIDATIMP-1599)

## [7.0.7](https://github.com/folio-org/ui-data-import/tree/v7.0.7) (2024-05-09)

### Bugs fixed:
* Changes made during duplication of "Default - Create SRS MARC Authority" job profile are not saved and affect original job profile. (UIDATIMP-1622)
* Changes made during duplication of a job with a match profile are not saved. (UIDATIMP-1637)

## [7.0.6](https://github.com/folio-org/ui-data-import/tree/v7.0.6) (2024-05-03)

### Bugs fixed:
* Update Order mapping rules to allow Material Type mapping when Purchase Order Status set to 'Open'. (UIDATIMP-1626)

## [7.0.5](https://github.com/folio-org/ui-data-import/tree/v7.0.5) (2023-12-06)

### Bugs fixed:
* Log summary table display errors when Items and Holdings are discarded (UIDATIMP-1573)
* Display correct match profile when switch between them (UIDATIMP-1569)

## [7.0.4](https://github.com/folio-org/ui-data-import/tree/v7.0.4) (2023-11-24)

### Bugs fixed:
* Action profiles links to wrong job profile. (UIDATIMP-1568)

## [7.0.3](https://github.com/folio-org/ui-data-import/tree/v7.0.3) (2023-11-09)

### Bugs fixed:
* The '[number of records] - records found' subtitle is displayed after clicking on the textLink error counter (UIDATIMP-1549)
* Display loading spinners while running jobs and job log displays are loading. (UIDATIMP-1557)
* Resolve long loading times for running jobs and job log displays. (UIDATIMP-1557)
* Invalid log when attempting to create item without SRS and Instance. (UIDATIMP-1564)

## [7.0.2](https://github.com/folio-org/ui-data-import/tree/v7.0.2) (2023-11-07)

### Bugs fixed:
* Totals inaccurate on running composite job cards. Removed the 'failed jobs' display in those items and included erroneous jobs in the calculation of 'processed' job parts. (UIDATIMP-1563)
* Job profiles view - Jobs using this profile displaying multiple entries for single-part jobs. (UIDATIMP-1562)

## [7.0.1](https://github.com/folio-org/ui-data-import/tree/v7.0.1) (2023-10-27)

### Features added:
* Adjust the record options in Central tenant action profiles (UIDATIMP-1546)
* Adjust the record options in Central tenant action profiles (UIDATIMP-1547)
* Adjust the record options in Central tenant field mapping profiles (UIDATIMP-1553)

### Bugs fixed:
* Fix potential "Invalid Date" on completed file upload cards (UIDATIMP-1544)
* Align stripes dependencies (UIDATIMP-1550)
* Remove 'Something went wrong' message after clicking on the link in holdings and item column (UIDATIMP-1551)

## [7.0.0](https://github.com/folio-org/ui-data-import/tree/v7.0.0) (2023-10-13)

### Features added:
* Landing page: Create hotlink from job profile name in log to the job profile details (UIDATIMP-1355)
* Create hotlink from file name in job profile detail view to job log details (UIDATIMP-1356)
* Add accessibility testing to automated tests in ui-data-import (UIDATIMP-1372)
* Provide "required" field for notes and electronic access subfields in field mapping (UIDATIMP-1384)
* Avoid private paths in stripes-core imports (UIDATIMP-1414)
* Order field mapping: Add info icon to the Acq unit field (UIDATIMP-1426)
* Invoice field mapping: Add info icon to the Acq unit field (UIDATIMP-1427)
* View all: Create hotlink from job profile name in log to the job profile details (UIDATIMP-1428)
* Fix warnings in unit tests (part 2) (UIDATIMP-1437)
* Update Log details screen to support multiple holdings & items (UIDATIMP-1438)
* Update Log JSON screen to support multiple holdings (UIDATIMP-1439)
* Update Log JSON screen to support multiple items (UIDATIMP-1440)
* DI Log: change Discarded to No action (UIDATIMP-1446)
* DI Log: Make some changes to the Log header (UIDATIMP-1447)
* DI Job profiles: Redirect when job profile was deleted (UIDATIMP-1450)
* Sorting on landing page gives error (UIDATIMP-1454)
* Refactor the ViewJobLog component to be a functional component (UIDATIMP-1457)
* Job summary - format numbers in summary table (UIDATIMP-1459)
* Allow to handle text/plain content type when error occurs (UIDATIMP-1465)
* Clear searches when switching between profile types (UIDATIMP-1461)
* Extend schema for profile relations manipulations (UIDATIMP-1471)
* Change validation messages which were represented in code format (UIDATIMP-1473)
* *BREAKING* bump `react` to `v18`, and dev-deps accordingly (UIDATIMP-1485)
* Match profile: update options for Instance "Incoming records" (UIDATIMP-1501)
* Match profile: update options for Holdings "Incoming records" (UIDATIMP-1502)
* Match profile: update options for Item "Incoming records" (UIDATIMP-1503)
* Match profile: update options for MARC Bibliographic "Incoming records" (UIDATIMP-1504)
* Match profile: update options for MARC Authority "Incoming records" (UIDATIMP-1505)
* Update Node.js to v18 in GitHub Actions (UIDATIMP-1507)
* leverage jest-config-stripes for all jest and testing-library packages (UIDATIMP-1508)
* *BREAKING* bump `react-intl` to `v6.4.4` (UIDATIMP-1520)
* Bump the major versions of @folio/plugin-find-organization optionalDependencies (UIDATIMP-1532)
* Implement file upload to S3 (UIDATIMP-1460)
* Perform rough split on front-end for multipart Upload (UIDATIMP-1468)
* Notify users that large files will be split (UIDATIMP-1463)
* Retrieve backend configuration for splitting in UI (UIDATIMP-1462)
* Render details of composite jobs in on consolidated running job cards (UIDATIMP-1466)
* Display a link to download a slice from the automated splitting process (UIDATIMP-1510)
* Cancel upload/running a split job (UIDATIMP-1469)
* Fetch Job summary data with for a particular tenant id (UIDATIMP-1540)

### Bugs fixed:
* Fix all the failed accessibility tests in ui-data-import (UIDATIMP-1393)
* Cannot clear data import profiles search in settings (UIDATIMP-1413)
* Error when trying to close log details page after redirecting to Data import app from Job profiles page (UIDATIMP-1435)
* JSON screen: Record type tabs do not fit into header box size (UIDATIMP-1442)
* Order field mapping profile: Fix Acquisitions units field label (UIDATIMP-1444)
* Log page "Authority" tab of imported Marc Authority record is not displaying record's details (UIDATIMP-1458)

## [6.0.8](https://github.com/folio-org/ui-data-import/tree/v6.0.8) (2023-04-04)

### Bugs fixed:
* Order field mapping profile: Cannot save the profile when switching between Order formats (UIDATIMP-1419)
* Activate "Location" field for Open Order field mapping (UIDATIMP-1429)
* Order field mapping profile: Get confirmation modal after form submitting (UIDATIMP-1431)
* Use local Harness mock to avoid tests failure (UIDATIMP-1434)
* Fix eslint errors (UIDATIMP-1436)

## [6.0.3](https://github.com/folio-org/ui-data-import/tree/v6.0.3) (2023-03-30)

### Bugs fixed:
* Order field mapping profile: Fix the View UI for Fund value % and Currency (UIDATIMP-1404)
* Order field mapping profile: Fix the View UI for Discount Currency (UIDATIMP-1405)
* Order field mapping profile: Inactivate Locations and Material Types fields when Order status is Open (UIDATIMP-1417)
* Order field mapping profile: Disable Organization lookup-up when Access provider field disabled (UIDATIMP-1418)
* Mock `react-virtualized-auto-sizer` module for unit tests (UIDATIMP-1422)

## [6.0.2](https://github.com/folio-org/ui-data-import/tree/v6.0.2) (2023-03-24)

### Bugs fixed:
* Order field mapping profile: Fix the UI and error message for the fund "Value" field (UIDATIMP-1387)
* Field mapping profile Invoice Edit screen: Accounting code field is disabled when Vendor name is selected (UIDATIMP-1394)
* Order field mapping profile: Add info icon to the Purchase order status fieldPurchase order status a required field (UIDATIMP-1397)
* Order field mapping profile: Inactivate some fields when Order format is Electronic (UIDATIMP-1400)
* Order field mapping profile: Inactivate some fields when Order format is Physical or Other (UIDATIMP-1401)
* Order field mapping profile: Inactivate Create Inventory fields when Order status is Open (UIDATIMP-1402)
* Adjust mapping details for DI wrt PO prefixes and suffixes (UIDATIMP-1408)
* The "Organization look-up" is disabled after creating the New field mapping profile (UIDATIMP-1416)

## [6.0.1](https://github.com/folio-org/ui-data-import/tree/v6.0.1) (2023-03-14)

### Bugs fixed:
* Error when saving a field mapping profile with some (not all) of related action profiles unlinked - Fixed (UIDATIMP-1350)
* Override purchase order lines limit setting field allows saving fractional numbers (UIDATIMP-1383)
* Order field mapping profile: Fix the values in the Payment status field (UIDATIMP-1386)
* Manual clearing of the Vendor/Material supplier/Access provider fields is not working properly (UIDATIMP-1388)
* Order import: creating an order with Receipt not required causes an error (UIDATIMP-1389)
* Data Import Action/Field mapping profiles in modal window are not in alpha order by default on Create screen (UIDATIMP-1390)
* Field mapping profile Invoice: enabled prop set to false when the value exists for Accounting code field (UIDATIMP-1392)
* Order field mapping profile: Make Purchase order status a required field (UIDATIMP-1396)
* Order field mapping profile: Adjust text for info icon for Physical resource Create inventory field (UIDATIMP-1398)
* Order field mapping profile: Adjust text for info icon for E-resources Create inventory field (UIDATIMP-1399)

## [6.0.0](https://github.com/folio-org/ui-data-import/tree/v6.0.0) (2023-02-24)

### Features added:
* Field Mapping Profile details: Order PO & POL from MARC Bib (Create/Edit) (UIDATIMP-294)
* Update the Match profile UI: Create/Edit screen (UIDATIMP-1214)
* Update the Action profile UI: Create/Edit screen (UIDATIMP-1215)
* Create the field mapping profile for Orders and Order Lines: View (UIDATIMP-1217)
* Update the Action profile UI for Orders (UIDATIMP-1231)
* Update the Action profile UI again: Create/Edit screen (UIDATIMP-1246)
* Create the UI for the Orders JSON tab in the DI job log (UIDATIMP-1257)
* Create hotlink from "Created" in DI Log Orders column to POL (UIDATIMP-1258)
* Create the UI for the Orders Log info in the DI job log (UIDATIMP-1264)
* Add required field asterisks & validation action to Order field mapping profile (UIDATIMP-1265)
* Add required info icons to Order field mapping profile (UIDATIMP-1266)
* Data Import field mapping profile: Enable FOLIO record type = Orders (UIDATIMP-1267)
* Cover Order field mapping profile with unit tests (UIDATIMP-1291)
* Add required info icons to Holdings field mapping profile (UIDATIMP-1292)
* Add required info icons to Item field mapping profile (UIDATIMP-1293)
* Change imports for ListTemplate component in ui-data-import (UIDATIMP-1301)
* ISRI: Suppress ISRI imports from the Data Import landing page, despite the job profile used (UIDATIMP-1314)
* ISRI: Filter the ISRI imports on the Data Import View all page, despite the job profile used (UIDATIMP-1315)
* Allow edit and duplicate Default - Create SRS MARC Authority job profile (UIDATIMP-1318)
* Improve mapping profile for Orders (UIDATIMP-1333)
* Order field mapping profile: Include default value for PO line limit setting (UIDATIMP-1337)
* leverage cookie-based authentication in all API requests (UIDATIMP-1338)
* Get rid of BigTest in ui-data-import (UIDATIMP-1343)
* Bump `stripes-*` and upgrade `react-redux` to `v8` (UIDATIMP-1353)
* Ensure accepted values property for "Contributor type" field mapping (UIDATIMP-1361)
* Adjust UI permission for DI Settings (UIDATIMP-1375)
* Provide "required" property for "productId" field mapping (UIDATIMP-1380)

### Bugs fixed:
* Invoice field mapping profile: Vendor name lookup is hidden (UIDATIMP-1290)
* Order and Order line field mapping: View screen updates (UIDATIMP-1304)
* Order and Order line field mapping: Create/Edit screen updates (UIDATIMP-1305)
* Data Import profiles not in alpha order (UIDATIMP-1330)
* Accessibility errors: Data Import Field mapping Orders View screen (UIDATIMP-1332)
* Error during switching between record types on field mapping profile form: Part 2 (UIDATIMP-1334)
* Data import tries to load notes json schema that doesn't exist (UIDATIMP-1339)
* Order field mapping profile: Address data not stacked properly (View) (UIDATIMP-1342)
* Error after selecting order option on field mapping profile (UIDATIMP-1344)
* Error after selecting order option on field mapping profile: Part 2 (UIDATIMP-1346)
* Receiving value disappears from Order field mapping profile after default order line limit updated (UIDATIMP-1348)
* Error when saving a field mapping profile with some (not all) of related action profiles unlinked (UIDATIMP-1350)
* Data Import Field Mappings (Item, Holdings, Instance) Inability to go back to defaults (UIDATIMP-1357)
* Empty Order type after switching to another FOLIO record type on existing order field mapping profile (UIDATIMP-1359)
* Order field mapping profile: Update the list of product identifier types (UIDATIMP-1362)
* "Something went wrong" error message appears after trying to reach JSON tab (UIDATIMP-1363)
* Order field mapping: Vendor field error message (UIDATIMP-1366)
* Order field mapping profile: Show the fund and code when default fund is selected (UIDATIMP-1367)
* Order field mapping profile: Show the expense class and code when default expense class is selected (UIDATIMP-1368)
* "parentProfiles" and "childProfiles" properties are populated on profile update that causes to size-bloat (UIDATIMP-1369)
* Order line field mapping: Fix organizations on edit screen (UIDATIMP-1371)
* Add permission for viewing Order and Order lines on JSON tab in DI Settings (UIDATIMP-1376)
* Add permission for viewing adding Acquisition Methods on Field mapping profiles (UIDATIMP-1381)

## [5.3.10](https://github.com/folio-org/ui-data-import/tree/v5.3.10) (2022-12-05)

### Bugs fixed:
* "Completed with errors" after double clicking run import (UIDATIMP-1299)

## [5.3.9](https://github.com/folio-org/ui-data-import/tree/v5.3.9) (2022-12-04)

### Bugs fixed:
* Upgrade moment from 2.24.0 to >= 2.29.4 fixing vulns (UIDATIMP-1317)
* Loose plugin dependencies permit incompatible versions (UIDATIMP-1323)

## [5.3.7](https://github.com/folio-org/ui-data-import/tree/v5.3.7) (2022-11-28)

### Bugs fixed:
* Fix path for getting identifierTypes when creating new match profile (UIDATIMP-1319)

## [5.3.6](https://github.com/folio-org/ui-data-import/tree/v5.3.6) (2022-11-24)

### Bugs fixed:
* Missing associated profiles on edit screen on Action/Field mapping profiles (UIDATIMP-1296)
* Data import settings: Shortcuts for creating, editing and duplicating don't work (UIDATIMP-1300)
* Fix path for getting identifierTypes on the match profiles list

## [5.3.5](https://github.com/folio-org/ui-data-import/tree/v5.3.5) (2022-11-17)

### Bugs fixed:
* After duplicating profiles the previous view details information is displayed (UIDATIMP-1285)
* Invoice field mapping profile: sortBy param is missed for Bill to name field (UIDATIMP-1288)
* Incorrect name of the page in Edit mode of field mapping profile (UIDATIMP-1302)
* Update dependencies versions

## [5.3.1](https://github.com/folio-org/ui-data-import/tree/v5.3.1) (2022-10-27)

### Features added:
* Change UI flow for import jobs cancelled by users  (UIDATIMP-1173)
* Change UI flow for uploaded files deleted before import by users (UIDATIMP-1182)
* Make UI changes to the Data Import landing page (UIDATIMP-1218)
* UI flow for import jobs that finish before a user can cancel (UIDATIMP-1235)
* Get rid of jobExecutions request for the Preview section (UIDATIMP-1239)
* Add column for "Started running" in Data Import Landing page log area (UIDATIMP-1244)
* Add column for "Started running" in Data Import "View all" page (UIDATIMP-1245)
* Update the field mapping profile for MARC Authority Updates - Create/Edit screen (UIDATIMP-1247)
* Update the field mapping profile for MARC Authority Updates - View screen (UIDATIMP-1248)
* Change the View all User/Job profile filter searches from Begins to Contains (UIDATIMP-1254)
* Refactor job profiles to use Router instead of 'layout' param (UIDATIMP-1279)
* Refactor action profiles to use Router instead of 'layout' param (UIDATIMP-1280)
* Refactor match profiles to use Router instead of 'layout' param (UIDATIMP-1281)
* Refactor file extension profiles to use Router instead of 'layout' param (UIDATIMP-1282)

### Bugs fixed:
* Invoice Field Mapping profile: Acq unit and Batch group dropdown lists should be in alphabetical order (UIDATIMP-1236)
* Data Import Field mapping profile is reset to viewing mode if the page was refreshed during editing/duplication (UIDATIMP-1240)
* An error message is displayed for the "Invoice date" field when using a calendar (UIDATIMP-1242)
* Error during switching between record types on field mapping profile form (UIDATIMP-1250)
* Data import mapping for invoices will not display more than 10 expense classes (UIDATIMP-1256)

## [5.2.4](https://github.com/folio-org/ui-data-import/tree/v5.2.4) (2022-09-06)

### Bugs fixed:
* So many requests are sent from UI to server after creating match profiles (UIDATIMP-1241)

## [5.2.3](https://github.com/folio-org/ui-data-import/tree/v5.2.3) (2022-08-11)

### Bugs fixed:
* In the "Check in / Check out notes" section, the "Note type" field is not filled after selecting an accepted value (UIDATIMP-1129)
* Invoice Field Mapping profile: The 'Accepted values' dropdown contains only 10 records in the 'Batch group' field (UIDATIMP-1230)

## [5.2.2](https://github.com/folio-org/ui-data-import/tree/v5.2.2) (2022-08-05)

### Bugs fixed:
* View all logs: filters are not updated after logs deletion (UIDATIMP-1219)
* View all logs: User and Job filter contains only 10 records (UIDATIMP-1220)
* Change options for invoice level adjustments in Invoice field mapping (UIDATIMP-1223)

## [5.2.1](https://github.com/folio-org/ui-data-import/tree/v5.2.1) (2022-07-27)

### Bugs fixed:
* Long titles do not fit in the confirmation modal window header (UIDATIMP-1196)
* Checkbox on page 2+ of View all log list does not work properly (UIDATIMP-1199)
* Long name doesn't fit in the header of profiles on the settings page (UIDATIMP-1206)
* Log navigation problem when filtered error list is closed (UIDATIMP-1207)
* Long titles don't fit in the green popup notification about a profile (UIDATIMP-1208)
* Github Actions: The yarn test step fails on upgrading Node to version 16 LTS (UIDATIMP-1211)

## [5.2.0](https://github.com/folio-org/ui-data-import/tree/v5.2.0) (2022-07-08)

### Features added:
* Add checkboxes and delete action to Data Import landing page (UIDATIMP-1077)
* Add Admin note field to the Instance field mapping profile: Create/Edit (UIDATIMP-1118)
* Add Admin note field to the Holdings field mapping profile: Create/Edit (UIDATIMP-1119)
* Add Admin note field to the Instance field mapping profile: View (UIDATIMP-1121)
* Add Admin note field to the Item field mapping profile: Create/Edit (UIDATIMP-1120)
* Add checkboxes and delete action to Data Import view all page (UIDATIMP-1078)
* Add Admin note field to the Holdings field mapping profile: View (UIDATIMP-1122)
* Add Admin note field to the Item field mapping profile: View (UIDATIMP-1123)
* Display Authority information on Data import log page: View (UIDATIMP-1053)
* Fix and Cover ViewAllLogs component with unit tests: Test (UIDATIMP-1151)
* Add UI validation for some Invoice field mapping profile fields (UIDATIMP-1134)
* Add summary at top of individual import job's log (UIDATIMP-1153)
* For the Data Import View all page, change from Load more to Paginated (UIDATIMP-1147)
* Change the status message for import jobs that are stopped by users (UIDATIMP-1148)
* For long Data import logs, change from Load more to Paginated (UIDATIMP-1146)
* Fix unit tests after update way of usage Pane component (UIDATIMP-1165)
* Update match screen UI for Holdings (UIDATIMP-1047)
* Update match screen UI for Instances (UIDATIMP-1046)
* Update match screen UI for Items (UIDATIMP-1048)
* Create a new Data import UI permission for only viewing settings (UIDATIMP-1145)
* Use API for deleting data import logs on Data Import landing page (UIDATIMP-1126)
* replace babel-eslint with @babel/eslint-parser (UIDATIMP-1150)
* Remove additional validation in the "Currency" field (UIDATIMP-1167)
* Create a new Data import UI permission for deleting import logs (UIDATIMP-1144)
* When new data import log summary is opened, old UI from previous log summary is displayed (UIDATIMP-1164)
* Update Data import UI permission for POL/VRN (UIDATIMP-1161)
* Change Import log hotlinks to textLink: View all page (UIDATIMP-1170)
* Change Import log hotlinks to textLink: Landing page (UIDATIMP-1169)
* When user have Can view only permission, don't show Actions and +New buttons (UIDATIMP-1174)
* Change Import log hotlinks to textLink: Log details screen (UIDATIMP-1171)
* Change Job profile tree hotlinks to textLink, in Settings/Data import (UIDATIMP-1180)
* Add line between log summary and record list (UIDATIMP-1168)
* Change associated hotlinks in Match, Action, Field mapping profiles to textLink, in Settings/Data import (UIDATIMP-1181)
* Prefer @folio/stripes exports to private paths when importing Calendar component (UIDATIMP-942)
* Accessibility check: Individual job log screen (UIDATIMP-1154)
* View all logs: User filter contains only users displayed on a specific page (UIDATIMP-1178)
* Connect summary table of import job's log to BE (UIDATIMP-1163)
* View all logs: Job profile filter contains only profiles displayed on a specific page (UIDATIMP-1177)
* Create a new Data import UI permission for only viewing app and logs (UIDATIMP-1187)
* Update the "Data Import: All permissions" permission (UIDATIMP-1143)
* Check for accessibility issues on updated match screens (UIDATIMP-1052)
* Add error hotlinks to the summary at top of individual import job's log (UIDATIMP-1158)
* Fix Accessibility problems on /data-import view all logs page. (UIDATIMP-1162)
* When closing the individual job log, return to the DI Landing page or View all properly. (UIDATIMP-1156)
* Replace react-highlighter with a react-17/18 compatible alternative (UIDATIMP-1152)
* Resizable Panes - Persistence | Use PersistedPaneset smart component for Data import/View all page (UIDATIMP-979)
* Use API for deleting data import logs on Data Import view all page (UIDATIMP-1127)
* Improve cql query to get job profiles for further import processing (UIDATIMP-1202)

### Bugs fixed:
* Data Import landing page log shows in old format instead of current format (UIDATIMP-1139)
* Some issues with log searching in Juniper Bugfest/Smoke testing (UIDATIMP-1125)
* QuotaExceededError: Failed to execute 'setItem' on 'Storage': Setting the value of 'profileTreeData' exceeded the quota (UIDATIMP-1166)
* Action button is missing on the data-import/job-summary page when select a job profiles (UIDATIMP-1183)
* Instance Field mapping profile: Admin note does not check for MARC or text validation (UIDATIMP-1189)
* The "select all items" button does not select all logs after deleting multiple logs from the landing logs page (UIDATIMP-1186)
* Job profiles allows user to sort by checkboxes (UIDATIMP-1188)
* View all logs table allows user to sort by checkboxes. (UIDATIMP-1190)
* Autofocus does not work after pressing the save button on the mapping-profiles editing page (UIDATIMP-1176)
* When go to Uploading jobs page or Settings Job profiles from View all page, an error is thrown (UIDATIMP-1192)
* Improve CQL queries for profiles retrieving (UIDATIMP-1204)
* The enabled indicator for duplicated field mapping fields is set to false (UIDATIMP-1191)
* Data import Reset all bug (UIDATIMP-1201)

## [5.1.6](https://github.com/folio-org/ui-data-import/tree/v5.1.6) (2022-07-05)

### Bugs fixed:
* QuotaExceededError: Failed to execute 'setItem' on 'Storage': Setting the value of 'profileTreeData' exceeded the quota (UIDATIMP-1205)

## [5.1.3](https://github.com/folio-org/ui-data-import/tree/v5.1.3) (2022-05-24)

### Bugs fixed:
* UI problem with Settings panes in Lotus Bugfest (UIDATIMP-1142)

## [5.1.2](https://github.com/folio-org/ui-data-import/tree/v5.1.2) (2022-03-24)

### Bugs fixed:
* Modify instead of Update while creating new Action profile (UIDATIMP-1103)
* Jobs always show up as current even though they were started months ago (UIDATIMP-1108)
* When you try to add a statistic code while creating a New field mapping profile, the line to enter it is not added on the first click. (UIDATIMP-1110)
* File import of the specific file is not works for a user with only "data-import" permissions set (UIDATIMP-1040)

## [5.1.1](https://github.com/folio-org/ui-data-import/tree/v5.1.1) (2022-03-04)

### Features added:
* Cover `<MatchingFieldsManager>` component with tests (UIDATIMP-712)
* Cover `<EditKeyShortcutsWrapper` component with tests (UIDATIMP-957)
* Cover `<ViewAllLogs>` component with tests (UIDATIMP-969)
* Cover `<ReturnToAssignJobs>` component with tests (UIDATIMP-960)
* Cover `<FieldOrganization>` component with tests (UIDATIMP-958)
* Add AUTHORITY type into folioRecordTypes (UIDATIMP-1021)
* Adjust the FOLIO record type in the field mapping profile (UIDATIMP-1027)
* Adjust the FOLIO record type in the action profile (UIDATIMP-1028)
* Cover `<ViewContainer>` component with tests (UIDATIMP-731)
* Cover `<ActionProfiles>` settings with tests (UIDATIMP-971)
* Use correct `css-loader` syntax (UIDATIMP-1037)
* Cover `getCRUDActions` with tests (UIDATIMP-1032)
* Settings : Updates to default job profiles (UIDATIMP-1024)
* Setting: Updates to Action profiles (UIDATIMP-1026)
* Adjust the FOLIO record type in the match profile (UIDATIMP-1029)
* Settings : Updates to default SRS Holdings job profile (UIDATIMP-1023)
* Populate Record Log title column when imported record is MARC Holdings (UIDATIMP-1007)
* Cover `<Jobs>` component with tests (UIDATIMP-959)
* Cover `<MatchProfiles>` settings with tests (UIDATIMP-975)
* Cover `<ProfileAssociator>` component with tests (UIDATIMP-717)
* Cover `<MappingProfiles/detailsSections/edit>` settings with tests (UIDATIMP-978)
* Cover `<UploadingJobsContextProvider>` component with tests (UIDATIMP-729)
* Cover `<UploadingJobsDisplay>` component with tests (UIDATIMP-730)
* Cover `FileExtensions` components with tests (UIDATIMP-973)
* Cover `<JobProfiles` component with tests (UIDATIMP-974)
* Add an Authority toggle and show response (UIDATIMP-1044)
* Cover `<SearchAndSort>` component with tests (UIDATIMP-723)
* Cover `<DataImportSettings>` settings with tests (UIDATIMP-972)
* Cover `src/utils` utils with tests (UIDATIMP-970)
* Use new API for DataImport landing page (UIDATIMP-918)
* Enable skipped test for <ExistingSection> component and check overall test coverage of ui-data-import (UIDATIMP-1065)
* Use new API for DataImport ViewAll page (UIDATIMP-1069)
* Remove 'react-dropzone' dependency (UIDATIMP-1072)
* Field mapping profiles created by auto tests couldn't be viewed (UIDATIMP-1073)
* Enable Action profile action for incoming MARC Authorities: Update MARC Authority records (UIDATIMP-1055)
* Enable Matching profile for incoming MARC Authorities (UIDATIMP-1054)
* Enable Field Mapping profile action for updating MARC Authorities records (UIDATIMP-1056)
* Job profiles are showing incorrect info for "Jobs using this profile" accordion (UIDATIMP-1081)
* Settings > Data Import > change focus (UIDATIMP-1085)
* When duplicating job profile, retain the details from the profile being duplicated (UIDATIMP-1082)
* Update Actions dropdown for several default profiles (UIDATIMP-1096)

### Bugs fixed:
* Need to be able to use the same match profile in the same job profile, with different actions (UIDATIMP-1067)
* Match Profile - Duplicate action does not display Existing record information (UIDATIMP-1102)

## [5.0.4](https://github.com/folio-org/ui-data-import/tree/v5.0.4) (2022-02-09)
### Bugs fixed:
* Need to be able to nest match profiles under action profiles (Kiwi HF) (UIDATIMP-1086)

## [5.0.3](https://github.com/folio-org/ui-data-import/tree/v5.0.3) (2021-11-25)

### Features added:
* Adjust UI for the Field protection create/edit screen. Extra scenario has been added (UIDATIMP-1043)

## [5.0.2](https://github.com/folio-org/ui-data-import/tree/v5.0.2) (2021-11-12)

### Features added:
* Adjust UI for the Field protection create/edit screen (UIDATIMP-1043)

## [5.0.1](https://github.com/folio-org/ui-data-import/tree/v5.0.1) (2021-10-19)

### Bugs fixed:
* Illegal character in query for mod-source-record-manager (UIDATIMP-1004)

## [5.0.0](https://github.com/folio-org/ui-data-import/tree/v5.0.0) (2021-10-08)

### Features added:
* Cover `<TreeLine>` component with unit tests (UIDATIMP-727)
* Refactor away from react-intl-safe-html (UIDATIMP-932)
* prefer @folio/stripes exports to private paths when importing components (UIDATIMP-927)
* Cover `<WithTranslation>` component with unit tests (UIDATIMP-733)
* Cover `<OptionsList>` component with unit tests (UIDATIMP-714)
* Cover `<MatchCriterion>` component with unit tests (UIDATIMP-711)
* Use `<PersistedPaneset>` smart component for Data Import landing page (UIDATIMP-884)
* Cover `<LogViewer>` component with unit tests (UIDATIMP-710)
* Cover `<FileItem>` component with unit tests (UIDATIMP-716)
* Cover `<ProfileTree>` component with unit tests (UIDATIMP-718)
* Cover `<Spinner>` component with unit tests (UIDATIMP-725)
* Cover `<ListView>` component with unit tests (UIDATIMP-709)
* Cover `<MARCTableView>` component with unit tests (UIDATIMP-962)
* Remove Acquisitions accordion from the holdings field mapping screen (UIDATIMP-820)
* Cover `<OverrideProtectedFieldsTable>` component with unit tests (UIDATIMP-715)
* Cover `<TextDate>` component with unit tests (UIDATIMP-726)
* Add hotlinks to the Import log summary for MARC imports (UIDATIMP-988)
* Cover `<RecentJobLogs>` component with unit tests (UIDATIMP-720)
* increment stripes to v7 (UIDATIMP-983)
* Cover `<MARCFieldProtection>` settings with tests (UIDATIMP-976)
* Cover `<RepeatableActionsField>` with unit tests (UIDATIMP-722)
* Cover `<withReferenceValues>` component with unit tests (UIDATIMP-732)
* Cover `<TreeView>` component with tests (UIDATIMP-728)
* Cover `<RecordTypesSelect>` component with unit tests (UIDATIMP-721)
* Field mappings: Item - update reference dropdown list for Item status to include new statuses (UIDATIMP-641)
* Expand module permissions with permissions for retrieving invoice and invoice lines (UIDATIMP-1003)
* Validate action profile has a field mapping profile before attaching to job profile (UIDATIMP-990)
* Cover `<WithValidation>` component with tests (UIDATIMP-961)
* Strict removing default job profile for quick-marc derive for Holdings (UIDATIMP-1012)
* Cover `<ListTemplate>` subcomponent with tests (UIDATIMP-708)
* Change MARC SRS bib column header and toggle (UIDATIMP-1011)
* Add hotlinks to the Import log summary for EDIFACT imports (UIDATIMP-989)
* Cover `<DetailsKeyShortcutsWrapper>` component with tests (UIDATIMP-956)
* Get rid of outdated componentWillReceiveProps method in SearchAndSort component (UIDATIMP-1001)
* refactor psets away from backend ".all" permissions (UIDATIMP-1017)

### Bugs fixed:
* Auxiliary "repeatableFieldAction" property disappear while removing "vendor reference number" field mapping (UIDATIMP-987)
* Cannot add matches or actions to a job profile (UIDATIMP-1002)
* Invoice field mapping profile only displays first 10 acq unit values (UIDATIMP-1008)
* Imported Invoice JSON log screen does not display (UIDATIMP-1010)
* Error getting metadata for record (UIDATIMP-1018)
* Dropdown component not working properly after updating to React v17 (UIDATIMP-1006)

## [4.1.5](https://github.com/folio-org/ui-data-import/tree/v4.1.5) (2021-10-01)

### Bugs fixed:
* EDIFACT invoices fail to import properly due to invalid "value" retrieving for vendor's accountingCode - Juniper env (UIDATIMP-1005)

## [4.1.4](https://github.com/folio-org/ui-data-import/tree/v4.1.4) (2021-08-23)

### Features added:
* prefer @folio/stripes exports to private paths when importing TextDate component (UIDATIMP-941)

## [4.1.3](https://github.com/folio-org/ui-data-import/tree/v4.1.3) (2021-08-03)

### Bugs fixed:
* Job profile fails because 1 action profile has 2 field mappings attached to it (UIDATIMP-931)

## [4.1.2](https://github.com/folio-org/ui-data-import/tree/v4.1.2) (2021-07-31)

### Features added:
* Ensure that the most recent 25 import logs display on the Data Import Landing Page (UIDATIMP-950)

### Bugs fixed:
* When closing the log summary, user sometimes goes to unexpected place (UIDATIMP-949)
* After editing the match profile the data does not change (UIDATIMP-951)

## [4.1.1](https://github.com/folio-org/ui-data-import/tree/v4.1.1) (2021-06-25)

### Features added:
* Expand module permissions with permissions for preceding and succeeding titles (UIDATIMP-943)
* Change "MARC_BIB" type to "MARC" (UIDATIMP-944)

## [4.1.0](https://github.com/folio-org/ui-data-import/tree/v4.1.0) (2021-06-17)

### Features added:
* Cover `<ImportJobs>` component with unit tests (UIDATIMP-706)
* Update import for stripes-final-form (UIDATIMP-912)
* Compile Translation Files into AST Format (UIDATIMP-888)
* Data Import Settings > Apply baseline shortcut keys for Job profile (UIDATIMP-898)
* Data Import Settings > Apply baseline shortcut keys for Action profile (UIDATIMP-900)
* Data Import Settings > Apply baseline shortcut keys for Match profile (UIDATIMP-899)
* Data Import Settings > Apply baseline shortcut keys for Field Mapping profile (UIDATIMP-901)
* Update jest-related configs (UIDATIMP-928)
* Rename constant "MARC" to "MARC_BIB" (UIDATIMP-917)
* Data Import Settings > Apply baseline shortcut keys for File Extension (UIDATIMP-879)
* Update version of interfaces due to supporting MARC Authority records (UIDATIMP-933)
* Import log summary: add a way to navigate back to the Landing page or View all page (UIDATIMP-913)
* Field Mapping profiles: For Holdings and Items, add validation for the "Staff only" field (UIDATIMP-920)
* Cover `<Section>` component with unit tests (UIDATIMP-724)

### Bugs fixed:
* folio-testing UI is completely broken for all apps (UIDATIMP-915)
* Cannot run a data import job in any of the hosted ref envs (UIDATIMP-925)
* Action profiles that have been unlinked from job profiles sometimes reappear (UIDATIMP-910)

## [4.0.3](https://github.com/folio-org/ui-data-import/tree/v4.0.3) (2021-04-20)

### Features added:
* Update the UI options for the repurposed quickMARC derive profile (UIDATIMP-890)
* Suppress quickMARC derive action and field mapping profiles from each other's associated profiles (UIDATIMP-891)
* Suppress quickMARC derive action profile from Job profile create/update (UIDATIMP-892)
* Suppress quickMARC derive job profile from the Choose jobs list (UIDATIMP-893)
* Disallow the upload of files without file extensions (UIDATIMP-896)

### Bugs fixed:
* Iris Bugfest: Error when trying to view the record-level details in the import log (UIDATIMP-903)
* Error popup displays when trying to view log when there is an error (UIDATIMP-905)

## [4.0.2](https://github.com/folio-org/ui-data-import/tree/v4.0.2) (2021-04-14)

### Features added:
* Add required field indication and validation to invoice field mapping profile (UIDATIMP-877)
* Cover`<ListTemplate>` component with tests (UIDATIMP-707)
* Log lite - Invoice JSON screen (UIDATIMP-817)

### Bugs fixed:
* Numeric subfield mappings are not working. Fixed (UIDATIMP-885)
* FOLIO record type dropdown issue. Fixed (UIDATIMP-887)

## [4.0.1](https://github.com/folio-org/ui-data-import/tree/v4.0.1) (2021-04-02)

### Features added:
* Adjust the UI for action profiles when linked to job profiles (UIDATIMP-749)
* Adjust the UI for action profiles when linked to field mapping profiles (UIDATIMP-870)
* Cover `<ProhibitionIcon>` component with unit tests (UIDATIMP-719)
* MARC Updates field mapping profile: be able to collapse/expand accordions (UIDATIMP-858)
* Ensure file name info for records posted direct via API on landing page (UIDATIMP-873)
* Log lite: Import job summary for EDIFACT invoices (UIDATIMP-816)
* Cover `<CodeHighlight>` component with tests (UIDATIMP-702)
* Cover `<FolioRecordTypeSelect>` component with tests (UIDATIMP-705)
* Cover `<JobLogsContainer>` component with tests (UIDATIMP-713)

## [4.0.0](https://github.com/folio-org/ui-data-import/tree/v4.0.0) (2021-03-18)

### Features added:
* Reuse `<JobsList>` component from `stripes-data-transfer-components` rep (UIDATIMP-573)
* Cover `<AcceptedValuesField>` component with unit tests (UIDATIMP-692)
* Cover `<MappedHeader>` component with unit tests (UIDATIMP-693)
* Reuse `<JobsListAccordion>` component from `stripes-data-transfer-components` rep (UIDATIMP-574)
* Reuse `<JobsLogs>` component from `stripes-data-transfer-components` rep (UIDATIMP-572)
* Reuse `<Preloader>` component from `stripes-data-transfer-components` rep (UIDATIMP-580)
* Reuse utils from `stripes-data-transfer-components` rep (UIDATIMP-576)
* Reuse `<SearchResults>` component from `stripes-data-transfer-components` rep (UIDATIMP-581)
* Cover `<BooleanActionField>` component with tests (UIDATIMP-700)
* Reuse `<SearchForm>` component from `stripes-data-transfer-components` rep (UIDATIMP-582)
* Implement a basic layout for the Import job summary page (UIDATIMP-750)
* Cover `<ActionMenu>` component with tests (UIDATIMP-699)
* Field mapping for repeatable fields needs a tweak to validation (UIDATIMP-768)
* Cover `<Callout>` component with tests (UIDATIMP-701)
* Cover `<DataFetcher>` component with tests (UIDATIMP-703)
* Add "Load more" button to an Individual job's log details page (UIDATIMP-756)
* Log lite - import job summary page, from View all page (UIDATIMP-762)
* Enable EDIFACT invoice options in various settings (UIDATIMP-778)
* Cover `<DatePickerDecorator>` component with tests (UIDATIMP-704)
* Add "Load more" button to View all log page (UIDATIMP-755)
* Update the UI permission names for current Data import permissions (UIDATIMP-781)
* Suppress Inventory single record MARC imports from data import log on landing page (UIDATIMP-659)
* Add filter for Inventory single record imports to the View all log screen (UIDATIMP-671)
* Match profile: Add validation to "Existing record" details (UIDATIMP-782)
* Data Import Field Mapping Profile details: Create/Edit Invoice and Invoice line from EDIFACT Invoice (UIDATIMP-296)
* Data Import Field Mapping Profile details: Toggles should display currency selected in Currency select in Extended information accordion(UIDATIMP-801)
* Data Import Field Mapping Profile details: Fund distribution section should be visible only when "Not prorated" option in Pro rate select is selected (UIDATIMP-802)
* Data Import Field Mapping Profile details: Extend functionality of AcceptedValuesField component to be able to choose several option (UIDATIMP-803)
* Disallow UI edit & deletion of the System-supplied default OCLC single record import profiles (UIDATIMP-784)
* Data Import Field Mapping Profile details: Create functionality for "Vendor name" and "Accounting code" fields for Vendor information accordion (UIDATIMP-800)
* Connect the Log light page to the server (UIDATIMP-763)
* Remove "secret button" from Choose jobs screen (UIDATIMP-812)
* Log lite - revised JSON screen (UIDATIMP-751)
* Log lite - Error handling for revised JSON screen (UIDATIMP-765)
* Update stripes to v6 (UIDATIMP-815)
* Suppress OCLC Single record import job profiles from the Choose jobs list (UIDATIMP-819)
* Refactor File Extensions view to use final-form instead of redux-form (UIDATIMP-825)
* Allow 005 to be a protected field (UIDATIMP-835)
* Update stripes-cli to v2 (UIDATIMP-840)
* Refactor Job profiles to use final-form instead of redux-form (UIDATIMP-829)
* Invoice mapping screen, FE updates according last BE changes (UIDATIMP-842)
* Update invoice status value in field mapping profile (UIDATIMP-830)
* Action profiles: Remove MARCcat qualifier from MARC record types (UIDATIMP-843)
* Refactor Match profiles to use final-form instead of redux-form (UIDATIMP-828)
* Invoice field mapping profile: Adjust vendor reference number (UIDATIMP-845)
* Data Import Field Mapping Profile View: Invoice and Invoice line from EDIFACT Invoice (UIDATIMP-783)
* Refactor Action profiles to use final-form instead of redux-form (UIDATIMP-827)
* Add personal data disclosure form (UIDATIMP-786)
* Adjust "vendor name" field value (UIDATIMP-868)

### Bugs fixed:
* Fix Accessibility problems for settings/data-import/match-profiles (lists must only directly contain li elements) (UIDATIMP-452)
* Fix Accessibility problems for settings/data-import/action-profiles?layer=create (Buttons must have discernible text) (UIDATIMP-448)
* Fix Accessibility problems for settings/data-import/{...-profiles} (Form elements must have labels) (UIDATIMP-457)
* Fix Accessibility problems in ProfileLinker Component (settings/data-import/job-profiles) (UIDATIMP-434)
* Fix an error occurred while searching for associated profiles (UIDATIMP-769)
* Status descending sort on Data Import home page not working. Fixed (UIDATIMP-758)
* Fix an error on switching existing record types on Match profile Create/edit screen (UIDATIMP-804)
* File upload in progress displays when it shouldn't. Fixed (UIDATIMP-742)
* A few updates to the invoice field mapping screen (UIDATIMP-811)
* Fix possibility to create match profile (UIDATIMP-821)
* Match profiles: Remove EDIFACT (UIDATIMP-844)
* Settings > Data import. Learn more button leads to empty page on Confluence (UIDATIMP-838)
* Remove validation error message from invoice field mapping screen (UIDATIMP-814)
* Cannot view log for OCLC Single record import jobs. Fixed (UIDATIMP-848)
* Create/Edit Match Profile WCAG 2.1 AA - Color Contrast violation (UIDATIMP-818)
* Invoice field mapping screen: Remove validation from fields with reference values (UIDATIMP-855)
* Protection fields in field mapping profile only lists 10. Fixed (UIDATIMP-849)
* Invoice field mapping: Lock total checkbox is not working properly. Fixed (UIDATIMP-857)
* Invoice field mapping: Exchange rate checkbox is not being saved. Fixed (UIDATIMP-864)
* Invoice field mapping profile: Subscription start date field misaligned (UIDATIMP-850)
* Match profile: form values are reset on page resize (UIDATIMP-867)
* Fix Accessibility problems for settings/data-import/{...-profiles} (id attribute value must be unique) (UIDATIMP-462)
* Match profile: existing record value not working for MARC 001 (UIDATIMP-865)
* Update module permission for logs retrieving (UIDATIMP-872)
* Field mapping profiles. Note type dropdown not loaded for item entity (UIDATIMP-866)

## [3.0.3](https://github.com/folio-org/ui-data-import/tree/v3.0.3) (2020-11-13)

### Bugs fixed:
* Fix Validation for default data typed into a field mapping profile (UIDATIMP-746)
* 'Reset all' functionality leads to error page (UIDATIMP-754)

## [3.0.2](https://github.com/folio-org/ui-data-import/tree/v3.0.2) (2020-11-05)

### Bugs fixed:
* Log filter dropdowns by job profile and user are not in alphabetical order (UIDATIMP-601)
* Cannot delete an import stuck in "Running" (UIDATIMP-738)
* Fix matching by `id` for Holdings and Item (UIDATIMP-747)
* Bugfest: Search the log list on the View all log screen does not work as expected (UIDATIMP-744)
* Bugfest: Log filter dropdowns by job profile and user are not in alphabetical order (UIDATIMP-743)
* Attempt to sort JobLogs table by status leads to error (UIDATIMP-741)
* Match profiles are misaligned and have a stray line in them (UIDATIMP-739)

## [3.0.1](https://github.com/folio-org/ui-data-import/tree/v3.0.1) (2020-10-27)

### Bugs fixed:
* MARC Bib field mapping profile: inconsistency with the layout (UIDATIMP-694)
* MARC Bib field mapping profile: error while saving MARC Modifications (UIDATIMP-695)
* MARC field protection settings not working in Honeysuckle Bugfest (UIDATIMP-734)

## [3.0.0](https://github.com/folio-org/ui-data-import/tree/v3.0.0) (2020-10-15)

### Features added:
* Handle import of stripes-acq-components to modules and platform (UISACQCOMP-3)
* Add validation rules for Move action for the MARC modifications table fields (UIDATIMP-492)
* Add validation rules for Edit action for the MARC modifications table fields (UIDATIMP-489)
* Increment `@folio/stripes` to `v5` and update dependency on `react-router` (UIDATIMP-656)
* Reuse `<EndOfItem>` component from `stripes-data-transfer-components` repository (UIDATIMP-571)
* Fix field mapping for Item record check in/check out note (UIDATIMP-554)
* Field mappings: Repeatable field dropdown Validation (UIDATIMP-508)
* Inventory field mapping: Instance, Holding, Item: add REMOVE option (UIDATIMP-567)
* Field Mapping Profile details: MARC Bib from MARC Bib 10 - View details screen (UIDATIMP-494)
* Field Mapping Profile details: Have view details screen cover the entire screen (UIDATIMP-535)
* Reuse `<Progress>` component from `stripes-data-transfer-components` repository (UIDATIMP-575)
* Create `MARC field protection` settings screen (UIDATIMP-592)
* Reset repeatable fields to neutral when all rows deleted (UIDATIMP-607)
* Match profile: Add Instance UUID as a match option (UIDATIMP-589)
* Match profile: Add Holdings UUID as a match option (UIDATIMP-590)
* Match profile: Add Item UUID as a match option (UIDATIMP-591)
* Update MARC matching UI to differentiate [any] versus [blank] indicators (UIDATIMP-525)
* Reuse `<FullScreenForm>` component from `stripes-data-transfer-components` repository (UIDATIMP-578)
* Add option for Modify or Update MARC Bib field mapping profile (UIDATIMP-612)
* Update the available actions for Action profiles (UIDATIMP-559)
* Change Shelving order to unmappable on Holdings field mapping (UIDATIMP-611)
* Update the Field mapping View for repeatable fields options (UIDATIMP-555)
* Update the available options for Field mapping profile Incoming record types (UIDATIMP-560)
* Update the available Accepted data types for Job profiles (UIDATIMP-561)
* Update the available Incoming record options for Match profiles (UIDATIMP-562)
* Update the available Data type options for File extension settings (UIDATIMP-626)
* Connect MARC field protection settings to the server (UIDATIMP-621)
* Field mappings: Item - update reference dropdown list for Item status (UIDATIMP-529)
* Add validation for fields in MARC field protection settings (UIDATIMP-593)
* Add hover text for "Cannot be mapped" icon in field mappings (UIDATIMP-558)
* Remove "Edit job profile" from Choose jobs action menu (UIDATIMP-553)
* MARC Bib field mapping profile: details for Update Selected fields on Create/Edit screen (UIDATIMP-613)
* Update react-intl to v5 (UIDATIMP-643)
* Relocate the file upload area on the Data Import landing page (UIDATIMP-633)
* Sync with DTO updates. Modifying or updating the SRS MARC record (UIDATIMP-620)
* Update Datepicker decorator (TextDate component) (UIDATIMP-638)
* MARC Bib field mapping profile: details for Update Selected fields on View screen (UIDATIMP-614)
* Add column for Job status and Resequence columns (UIDATIMP-615)
* Match Profiles: Remove EDIFACT invoice as a match option (UIDATIMP-353)
* Change Data Import app name to sentence case (UIDATIMP-634)
* Add Public/Staff field for Holdings Statement Notes (UIDATIMP-642)
* Remove 'import/no-extraneous-dependencies' rule from eslint config and add missed dependencies (UIDATIMP-639)
* Refine an identifier matching for Instances (UIDATIMP-630)
* MARC Bib field mapping profile: add option for Modify or Update to View screen (UIDATIMP-625)
* Remove 'Manage' button from landing page (UIDATIMP-652)
* Refactor `bigtest/mirage` with `miragejs`.
* MARC Bib field mapping profile: details for Update-Overrides on Create/Edit screen (UIDATIMP-631)
* MARC Bib field mapping profile: details for Update-Overrides on View screen (UIDATIMP-632)
* Change "Check in/out note" value to "Check in/out" for items (UIDATIMP-679)
* Add capability to remove jobs that are stuck in "Running" area of Data Import landing page first pane (UIDATIMP-651)
* Match profile create-edit & view screens: change unusable options to disabled (UIDATIMP-676)
* MARC Bib field mapping profile: EXCEPTION details for Update Selected fields on Create/Edit screen (UIDATIMP-660)
* MARC Bib field mapping profile: EXCEPTION details for Update Selected fields on View screen (UIDATIMP-661)
* Action profile create-edit screen: change unusable options to disabled (UIDATIMP-673)
* Field mapping profile create-edit screen for instances: add sentence (UIDATIMP-678)
* MARC Bib field mapping profile: EXCEPTION details for Override protected fields on Create/Edit screen (UIDATIMP-662)
* MARC Bib field mapping profile: EXCEPTION details for Override protected fields on View screen (UIDATIMP-663)
* Field mapping profile create-edit screen: change unusable options to disabled (UIDATIMP-674)
* Job profile create-edit screen: change unusable options to disabled (UIDATIMP-675)
* Replace hyphens with `<NoValue>` component (UIDATIMP-628)
* Data Import App: Consume {{FormattedDate}} and {{FormattedTime}} via stripes-component (UIDATIMP-665)

### Bugs fixed:
* Fix rendering qualifier sections with old data in match profiles details (UIDATIMP-481)
* Fix for validation function `validateRequiredFields` (UIDATIMP-645)
* Fix `SyntaxError: Unexpected token 'export'` error when running tests (UIDATIMP-667)
* Fix "Position" in MCL View is not left justified (UIDATIMP-657)
* An error message appears when linking a match profile with Existing record field = "Identifier: ..." to a job profile (UIDATIMP-687)
* Only import MatchingFieldsManager once (UIDATIMP-689)
* Tweak syntax that caused ESLint to die early, allowing it complete, and find bugs like UIDATIMP-689 (UIDATIMP-690)
* MARC updates field mapping profile: override protected fields change sequence when edited (UIDATIMP-686)
* Fix sorting newly-created file extension settings in alphabetical order (UIDATIMP-681)
* In1, In2, Subfield defaults for subsequent update fields do not default to * (UIDATIMP-691)

## [2.1.4](https://github.com/folio-org/ui-data-import/tree/v2.1.4) (2020-08-13)

### Bugs fixed:
* Cannot create a holdings field mapping profile on Goldenrod bugfest, hotfix (UIDATIMP-619)

## [2.1.3](https://github.com/folio-org/ui-data-import/tree/v2.1.3) (2020-08-11)

### Bugs fixed:
* Fix saving subfield information of match profile, hotfix (UIDATIMP-604)

## [2.1.2](https://github.com/folio-org/ui-data-import/tree/v2.1.2) (2020-08-11)

### Bugs fixed:
* Fix Inconsistent in Holding schema between UI and Backend (UIDATIMP-596)
* Fix optional sections of match profile do not clear out when removed (UIDATIMP-597)

## [2.1.1](https://github.com/folio-org/ui-data-import/tree/v2.1.1) (2020-07-09)

### Features added:
* Get rid of imported translations for math profiles (UIDATIMP-570)

### Bugs fixed:
* Fix deletion repeatable fields in Field mapping profile (UIDATIMP-482)
* Fix assigning and unassigning tags to data import profiles (UIDATIMP-499)

## [2.1.0](https://github.com/folio-org/ui-data-import/tree/v2.1.0) (2020-06-25)

### Features added:
* Field Mapping Profile details: MARC Bib from MARC Bib 2 - Delete (UIDATIMP-486)
* Update Requests to SRS for v4 (UIDATIMP-486)

### Bugs fixed:
* Fix Accessibility problems for MARCTable component (UIDATIMP-547)
* Fix issue with holdings type field population (UIDATIMP-542)
* Fix issue with digitization policy field (UIDATIMP-543)
* Fix repeatable fields in Field mapping profiles (UIDATIMP-538)
* Fix Accessibility problems for /data-import page (UIDATIMP-429)
* Fix Accessibility problems for data-import/job-logs (Buttons must have discernible text) (UIDATIMP-432)
* Fix Accessibility problems for settings/data-import/job-profiles?layer=create (UIDATIMP-433)

## [2.0.0](https://github.com/folio-org/ui-data-import/tree/v2.0.0) (2020-06-12)

### Features added:
* Purge "intlShape" in prep for "react-intl" "v4" migration. (UIDATIMP-517)
* Data Import: Update to Stripes v4 (UIDATIMP-520)
* Add hotlinks for match and action profiles on Job profiles details view (UIDATIMP-478)
* Layout styles in repeatable sections, which contain withRepeatableActions decorator has been fixed (UIDATIMP-502)
* Implement basic layout for Field Mapping Profile details: MARC Bib from MARC Bib (UIDATIMP-297)
* Cover Mapping Profile Form with tests including field decorators (UIDATIMP-442)
* Implement add new row functionality for the Field Mapping Profile details (UIDATIMP-497)
* Change placement of repeatable decorator in the Inventory field mapping screens (UIDATIMP-518)
* Implement delete row functionality for the Field Mapping Profile details (UIDATIMP-498)
* Implement re-order row functionality for the Field Mapping Profile details (UIDATIMP-496)
* Add acceptedValues obj to reference dropdown fields (UIDATIMP-519)
* Get rid of "@folio/stripes-core" and "@folio/stripes-smart-components" dependencies
* Update "react-router" and "react-router-dom" dependencies
* Connect MARC modifications table to the Field mapping profile form (UIDATIMP-536)
* Add validation rules for Add action for the MARC modifications table fields (UIDATIMP-487)
* Migrate from `stripes.type` to `stripes.actsAs`
* Adjust mapping rules for repeatable fields in Field mapping profiles (UIDATIMP-544)
* Field Mapping Profile details: MARC Bib from MARC Bib 4 - Add Subsequent lines (UIDATIMP-488)

### Bugs fixed:
* Fix Item status list in field mapping profiles (UIDATIMP-515)
* Initial data doesn't show up for checkbox decorator for existing profiles (UIDATIMP-500)
* Update logic for reference dropdowns (UIDATIMP-516)
* Fix reference dropdowns long lists height (UIDATIMP-511)
* Update logic for reference dropdowns with datepicker (UIDATIMP-523)
* Add location code display to accepted values list (UIDATIMP-514)
* Reference dropdowns. Statistical code values lists has been updated (UIDATIMP-512)

## [1.8.3](https://github.com/folio-org/ui-data-import/tree/v1.8.3) (2020-04-27)

### Features added:
* Data Import field mapping profile details: Repeatable field dropdown component (UIDATIMP-401)
* Data Import field mapping profile details: Reference values dropdown component (UIDATIMP-402)
* Data Import field mapping profile details: Checkbox decorator (UIDATIMP-368)
* Cover MCL in mapping profile details sections with tests (UIDATIMP-469)
* Distinguish not mapped and unmappable fields in Field mapping profile View screen (UIDATIMP-471)
* Implement <ProhibitionIcon> component (UIDATIMP-477)
* Field mapping profile - Add line above associated action profiles (UIDATIMP-472)
* Label for Year field in caption section has been updated (UIDATIMP-475)
* Preceding/succeeding sections has been updated to match new Instance fields (UIDATIMP-476)
* Update dependency on stripes-smart-components to version 3.1.1 (UIDATIMP-485)
* Implement date picker decorator (UIDATIMP-407)
* Add validation for field mapping profile fields (UIDATIMP-405)

### Bugs fixed:
* When returned to search results screen after profile save, wrong profile details show (UIDATIMP-424)
* Optional sections are collapsed even if contain data (UIDATIMP-479)
* Fix tree lines in Job profile associations tree (UIDATIMP-343)
* Fix displaying of profile associations on a job profile tree (UIDATIMP-413)

## [1.8.2](https://github.com/folio-org/ui-data-import/tree/v1.8.2) (2020-04-07)

### Features added:
* Render Repeatable Fields as MultiColumnList in FlexibleForm static view when needed (UIDATIMP-445)
* Cover mapping profile details sections with tests (UIDATIMP-406)

### Bugs fixed:
* More than one record cannot be created in Mapping Profiles Form repeatable fields (UIDATIMP-443)
* Error message when assigning or unassigning a tag to a data import profiles (UIDATIMP-461)
* Trash can next to match profile match criteria should not be there (UIDATIMP-466)

## [1.8.1](https://github.com/folio-org/ui-data-import/tree/v1.8.1) (2020-03-31)

### Features added:
* Data Import Field Mapping Profile details: Inventory instance from MARC (UIDATIMP-15)
* Data Import Field Mapping Profile details: Inventory holdings from MARC Bib (UIDATIMP-290)
* Data Import Field Mapping Profile details: Inventory item from MARC Bib (UIDATIMP-292)
* Rearrange the match profile diagram structure (UIDATIMP-411)
* Wipe out lines from the match profile diagram (UIDATIMP-411)
* Provide a profile snapshot with childWrappers when new profile association added to a job profile (UIDATIMP-413)
* Data import settings Match Profiles: Changes for Static value Number, Date submatches (UIDATIMP-414)
* Set defaultMapping query param when data-import process is run with chosen JobProfile to false (UIDATIMP-418)
* Add "profileType" query param to request for get /profileSnapshots/{profileId} (UIDATIMP-444)

### Bugs fixed:
* Fix broken Record Type Selection Tree in RTL mode (UIDATIMP-425)
* Fix broken Match criterion section in RTL mode (UIDATIMP-426)
* Mapping Profiles Form existing record type recognition behavior is wrong (UIDATIMP-456)
* Fix hardcoded tenant value for the modules retrieving (UIDATIMP-465)
* Fix styles for the form text fields (UIDATIMP-426)

## [1.8.0](https://github.com/folio-org/ui-data-import/tree/v1.8.0) (2020-03-13)

### Features added:
* Attach a field mapping profile to an action profile that does not have one (UIDATIMP-269)
* Attach one or more action profiles to a field mapping profile (UIDATIMP-279)
* Create ProfileTree Component (UIDATIMP-326)
* Job profile details, part 1: adding match profiles (UIDATIMP-312)
* Job profile details, part 2: adding secondary match/action profiles (UIDATIMP-313)
* Add rules for prohibited profile siblings for the ProfileTree component (UIDATIMP-314)
* Job profile details, part 4: unlinking match or action profiles (UIDATIMP-315)
* Create FOLIO records' field lists (UIDATIMP-330)
* Connect Profile Associator Component to unified data source (UIDATIMP-341)
* Update field naming for mapping profiles (UIDATIMP-349)
* Data import settings page's 4th pane for Match Profiles: Changes needed to support Static value submatches (UIDATIMP-352)
* Connect Profile Tree Component to unified data source (UIDATIMP-357)
* Rework ProfileLinker Component (UIDATIMP-358)
* Data import settings page's 4th pane for Match Profiles: Create MARC records' match-to section (UIDATIMP-373)
* Convert Match Profiles form Existing Record Field name to JSONPath format (UIDATIMP-375)
* Define API Contract for MappingProfile field mapping definitions (UIDATIMP-377)
* Remove extra action buttons in profiles Settings screens (UIDATIMP-394 - UIDATIMP-397)
* Augment RecordTypeSelector component with Incoming Record Type selection dropdown (UIDATIMP-386)
* Job profile details: suppress the delete/trash can icon (UIDATIMP-390)
* Job Profile Tree: Changes needed to support Static value submatches (UIPFIMP-11)
* Add "defaultMapping" query param to "/processFiles" path (UIDATIMP-417)
* Add caret to the incoming record select dropdown in match profile
* Upgrade Stripes and all the dependencies to version 3.0.0 (UIDATIMP-422)
* Rename renewal.json to ongoing.json (UIDATIMP-428)
* Remove extra action buttons in File extension Settings screens after central component update (UIDATIMP-398)

### Bugs fixed:
* Profile Associator lists are empty when the user reloads the page with Profile Edit Form open (UIDATIMP-338)
* ProfileTree component TreeLines re-renders are late by one tick from state updates (UIDATIMP-343)
* ProfileTree component ProfileLinker dropdown doesn't close automatically after list option has chosen (UIDATIMP-345)
* Associated profiles not clearing out after viewing, like they should (UIDATIMP-354)
* Search and Sort don't work in Profile Associator Component in view mode (UIDATIMP-374)
* Fix wording of unlink confirmation modal (UIDATIMP-378)
* Fix wording of profile create/update confirmation toast (UIDATIMP-379)
* Page unstable error when trying to save match profile (UIDATIMP-380)
* Unlink action profile from field mapping profile is not working (UIDATIMP-381)
* ProfileAssociator Component lists are empty (UIDATIMP-399)
* Fix UI tests (UIDATIMP-399)
* Fix action profiles' sequence in job profiles (UIDATIMP-412)
* Wipe out linked profiles when duplicate a profile (UIDATIMP-410)
* Fix unlinking associated profiles from job profile (UIDATIMP-420)
* Fix Match Profile regressions (UIDATIMP-421)
* Fix existing record field name displaying on match profiles (UIDATIMP-427)

## [1.7.3](https://github.com/folio-org/ui-data-import/tree/v1.7.3) (2019-12-04)
* Update sorting query for jobs (UIDATIMP-346)
* Fix typo in a field mapping profile modal (UIDATIMP-336)

## [1.7.2](https://github.com/folio-org/ui-data-import/tree/v1.7.2) (2019-12-04)
* Add action options to choose jobs screen (UIDATIMP-268)
* Add non-editable mode feature for RecordTypesSelect component (UIDATIMP-323)
* Add match details to the View match profile details pane (UIDATIMP-239)
* Create Match Profiles Form renderer (UIDATIMP-325)
* Increase the width of the View details pane for Match profiles (UIDATIMP-332)
* Create Associator Component (UIDATIMP-275)
* Attach a field mapping profile to an action profile that does not have one (UIDATIMP-269)
* Attach one or more action profiles to a field mapping profile (UIDATIMP-279)
* Fix sentence case for Qualifier field dropdowns in Create/View match profile details (UIDATIMP-340)

## [1.6.0](https://github.com/folio-org/ui-data-import/tree/v1.6.0) (2019-11-01)
* Add details section on create/edit action profile form (UIDATIMP-207)
* Add details section of action profile details pane (UIDATIMP-280)
* Update format of settings cancel/save options (UIDATIMP-238)
* Add associated job profiles search on match profile details pane (UIDATIMP-178)
* Update requests for retrieving logs and jobExecutions (UIDATIMP-304)
* Fix unstable message for job profiles (UIDATIMP-305)
* Create "view all" log screen (UIDATIMP-285)
* Add search details for the "view all" log screen (UIDATIMP-286)
* Add filter details for the "view all" log screen (UIDATIMP-287)
* Update query for sorting by numeric field (UIDATIMP-310)
* Update dependency on source-record-manager (UIDATIMP-318)
* Remove "React to" from action profiles(UIDATIMP-316)

## [1.5.1](https://github.com/folio-org/ui-data-import/tree/v1.5.1) (2019-09-25)
* Create Section component (UIDATIMP-278)
* Create and integrate RecordTypesSelect component (UIDATIMP-244)
* Add a Records column to a job logs table, rename Import ID column to ID, swap columns and change width of panes (UIDATIMP-260)
* Fix save match profile (UIDATIMP-282)

## [1.5.0](https://github.com/folio-org/ui-data-import/tree/v1.5.0) (2019-09-10)
* Implement mapping profile duplication feature (UIDATIMP-228)
* Implement mapping profile deletion feature (UIDATIMP-229)
* Make mapping profile name a hotlink in action profile details (UIDATIMP-214)
* Add tags accordion for match profiles (UIDATIMP-18)
* Create TreeView component (UIDATIMP-243)
* Add choose jobs screen 2nd pane (UIDATIMP-257)
* Add job profile details pane on choose job profile page (UIDATIMP-258)
* Fix file extension validation by making it case insensitive (UIDATIMP-252)
* Add associated job profiles search on action profile details pane (UIDATIMP-217)
* Integrate updated MultiColumnList component (UIDATIMP-276)

## [1.4.0](https://github.com/folio-org/ui-data-import/tree/v1.4.0) (2019-08-02)
* Create data import settings page's 3rd pane for action profiles (UIDATIMP-8)
* Implement header caret actions for action profiles (UIDATIMP-14)
* Add form for new action profile action (UIDATIMP-144)
* Implement save the new action profile feature (UIDATIMP-145)
* Implement details view for action profiles (UIDATIMP-146)
* Add search box for 3rd pane of action profiles (UIDATIMP-167)
* Create edit action profile form (UIDATIMP-149)
* Add saving of edited action profile feature (UIDATIMP-220)
* Implement action profile deletion feature (UIDATIMP-215)
* Implement action profile duplication feature (UIDATIMP-148)
* Make job profile name a hotlink in action profile details (UIDATIMP-213)
* Add tags accordion for match profiles (UIDATIMP-16)
* Add tags accordion for action profiles (UIDATIMP-17)
* Create data import settings page's 3rd pane for Field Mapping Profiles (UIDATIMP-9)
* Implement details view for mapping profiles (UIDATIMP-219)
* Implement create mapping profile feature (UIDATIMP-227)
* Implement edit mapping profile feature (UIDATIMP-230)
* Generalize and modularize Modals and Toasts templates, create common Callout renderer (UIDATIMP-210)
* Generalize and modularize Entity List View templates, create common ListView component (UIDATIMP-211)
* Add fields to edit mapping profile screen (UIDATIMP-247)

## [1.3.0](https://github.com/folio-org/ui-data-import/tree/v1.3.0) (2019-06-12)
* Create data import settings page's 3rd pane for Match Profiles. Add string capitalization (capitalize) and HTML special chars decoding (htmlDecode) utils (UIDATIMP-6)
* Create temporary MARC Bib files load option on Choose jobs pane (UIDATIMP-185)
* Add Search box for 3rd pane of Match Profiles (UIDATIMP-166)
* Implement landing page changes when temporary MARC Bib Load option button pushed (UIDATIMP-186)
* Create the form for a new match profile creation (UIDATIMP-138)
* Reorganize testing folder structure and code improvements (UIDATIMP-200)
* Implement details view for match profiles (UIDATIMP-140)
* Save the new match profile (UIDATIMP-139)
* Create edit match profile form (UIDATIMP-143)
* Implement saving of edited match profile (UIDATIMP-182)
* Make job profile name a hotlink in match profile details (UIDATIMP-184)
* Implement match profile duplication feature (UIDATIMP-142)
* Implement match profile deletion feature (UIDATIMP-144)
* Refactor all the profile list views to generalize them and move common parts to separate components (UIDATIMP-201)
* Create ListTemplate and ColumnTemplate components for declarative definition of EntityList (UIDATIMP-201)
* Create MenuTemplate and ItemTemplate  components for declarative definition of ActionMenu, create ActionMenu component (UIDATIMP-201)
* Create Spinner and LastMenu components (UIDATIMP-201)
* Create LogViewer and modular CodeHighlight components among with modular language definitions (langJSON and langRAW for now) and 2 highlight themes (light - Coy and dark - Stalker) (UIDATIMP-209)
* Refine ViewJobLog page component with a new endpoint to show all the log including error ones through LogViewer component (UIDATIMP-209)
* Add missing icons for Match Profiles record types (UIDATIMP-194)
* Implement match profile deletion feature (UIDATIMP-176)

## [1.2.1](https://github.com/folio-org/ui-data-import/tree/v1.2.1) (2019-05-14)
* Downgrade okapi interface version in order to have data-import-converter-storage API endpoints work (UIDATIMP-195)

## [1.2.0](https://github.com/folio-org/ui-data-import/tree/v1.2.0) (2019-05-10)
* Create data import settings page's 3rd pane for Jobs Profiles (UIDATIMP-6)
* Add job profile form (UIDATIMP-132)
* Delete upload definition when it does not have files on the landing page so the user can start over new uploading process (UIDATIMP-110)
* Implement search job profiles feature (UIDATIMP-164)
* Implement save the new job profile feature (UIDATIMP-136)
* Implement job profile editing feature (UIDATIMP-137)
* Implement details view for job profiles feature (UIDATIMP-133)
* Align wording for the create new job profile submit button (UIDATIMP-179)
* Implement job profile duplication feature (UIDATIMP-134)
* Handle text wrapping issue in columns of the job profile results list (UIDATIMP-190)
* Implement job profile deletion feature (UIDATIMP-173)
* Handle text wrapping issue in columns of the job profile results list (UIDATIMP-190)
* Implement caret actions and items selection for job profiles (UIDATIMP-12)
* Add status check for failed backend responses on the UI (UIDATIMP-189)
* Create Log button in the jobs log list for showing the resulting SRS JSON document (UIDATIMP-187)

## [1.1.0](https://github.com/folio-org/ui-data-import/tree/v1.1.0) (2019-03-22)
* Add file extensions validation and `InvalidFilesModal` component for file upload (UIDATIMP-46)
* Hide popover when user clicks on the link button (UIDATIMP-71)
* Write documentation for `FileUploader` component and some code refactor (UIDATIMP-65)
* Create UI for styling for `Completed` file uploads (UIDATIMP-38)
* Prevent user navigation when file upload is in progress (UIDATIMP-67)
* Add document icon to upload file items (UIDATIMP-74)
* Setup BigTest and write tests for Jobs pane (UIDATIMP-75)
* Implement deleting failed files from server feature (UIDATIMP-72)
* Handle file name issue with file upload definition (UIDATIMP-97)
* Show error message on UI when there is not enough server space for uploaded file(s) on uploading job profiles (UIDATIMP-86)
* Create data import settings page's 3rd pane for File Extensions (UIDATIMP-47)
* Show modal on Leaving Choose Job Profile page (UIDATIMP-104)
* Prohibit file upload when there is a draft job in progress (UIDATIMP-106)
* Implement add new file extension feature (UIDATIMP-56)
* Handle sorting icons for both job logs and file extensions tables (UIDATIMP-124)
* Update API endpoints on UI due to changes on backend across the application (UIDATIMP-112, UIDATIMP-113, UIDATIMP-114)
* Implement "Save the new file extension" feature (UIDATIMP-79)
* Implement return to Choose Job Profile page functionality (UIDATIMP-103)
* Write tests for return to Choose Job Profile page functionality (UIDATIMP-154)
* Implement file extension editing feature (UIDATIMP-84)
* Fix file extensions order after adding/editing a file extension (UIDATIMP-159)
* Close invalid files modal after clicking "Choose other files to upload" button (UIDATIMP-160)
* Implement "Reset all extension mappings to system defaults" feature (UIDATIMP-55)
* Create data import File Extension Details view (UIDATIMP-61)
* Implement file extension deletion feature (UIDATIMP-69)
* Implement search file extensions feature (UIDATIMP-157)
* Handle horizontal scroll issue for the file extensions list (UIDATIMP-76)
* Hook up file upload behavior to file extension settings when uploads for certain extensions are forbidden (UIDATIMP-117)

## [1.0.0](https://github.com/folio-org/ui-data-import/tree/v1.0.0) (2018-11-10)
* New app created with stripes-cli
* Adjust skeleton application (UIDATIMP-2)
* Add app icon (UIDATIMP-19)
* Add layout for landing page (UIDATIMP-20)
* Add layout for first pane on Landing page (UIDATIMP-22)
* Create a reusable stripes component for "Preview" & "Running Jobs" boxes (UIDATIMP-31)
* Create UI for "File Upload" feature on Landing page (UIDATIMP-33)
* Create reusable react "Drag and Drop" component (UIDATIMP-35)
* Implement "Preview jobs" feature on Landing page (UIDATIMP-23)
* Implement "Logs" feature on Landing page (UIDATIMP-29)
* Update stripes-* dependencies and imports to use stripes framework 1.0 (FOLIO-1549)
* Implement data fetching for JobExecutions and JobLogs on Landing Page (UIDATIMP-27)
* Add Data Import settings page (UIDATIMP-5)
* Create UI for File Upload: Action & Styling for "In Process" file uploads (UIDATIMP-37)
