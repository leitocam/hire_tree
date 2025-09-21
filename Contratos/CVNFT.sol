
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract CVNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    // --- Celestia ref por token ---
    struct CelestiaRef {
        bytes10 subID;      // hasta 10 bytes (tu "hiretree00")
        uint64  height;     // bloque de Celestia
        bytes32 commitment; // hash/commitment del blob
    }
    mapping(uint256 => CelestiaRef) private _celestiaOf;

    event CelestiaRefSet(uint256 indexed tokenId, bytes10 subID, uint64 height, bytes32 commitment);

    // --- Control de minteo (adapter/minter designado) ---
    address public minter;
    event MinterUpdated(address indexed newMinter);

    constructor() ERC721("Hire3 Soft Skills CV", "H3CV") Ownable(msg.sender) {}

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
        emit MinterUpdated(_minter);
    }

    modifier onlyMinter() {
        require(msg.sender == minter, "Not authorized minter");
        _;
    }

    // --- MINTEO CON / SIN Celestia ---

    // Opción A: DEPRECADA (pero útil si quieres mantener compat)
    // function mint(address to, string memory metadataURI) external {
    //     uint256 tokenId = nextTokenId++;
    //     _safeMint(to, tokenId);
    //     _setTokenURI(tokenId, metadataURI);
    // }

    // Opción B: restringe el minteo a tu adapter
    function mint(address to, string memory metadataURI) external onlyMinter {
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
    }

    // Opción C (recomendada): mint + Celestia en la misma tx
    function mintWithCelestia(
        address to,
        string memory metadataURI,
        bytes10 subID,
        uint64  height,
        bytes32 commitment
    ) external onlyMinter {
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        _celestiaOf[tokenId] = CelestiaRef(subID, height, commitment);
        emit CelestiaRefSet(tokenId, subID, height, commitment);
    }

    // Setter por si quieres anclar después del mint (soloMinter u Owner)
    function setCelestiaRef(
        uint256 tokenId,
        bytes10 subID,
        uint64  height,
        bytes32 commitment
    ) external onlyMinter {
        require(_ownerOf(tokenId) != address(0), "Invalid tokenId");
        _celestiaOf[tokenId] = CelestiaRef(subID, height, commitment);
        emit CelestiaRefSet(tokenId, subID, height, commitment);
    }

    // Getter para UI/verificadores
    function celestiaOf(uint256 tokenId)
        external
        view
        returns (bytes10 subID, uint64 height, bytes32 commitment)
    {
        CelestiaRef memory r = _celestiaOf[tokenId];
        return (r.subID, r.height, r.commitment);
    }

    // --- Soulbound ---
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721) returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0)) {
            revert("Soulbound: token is non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert("Soulbound: no approvals");
    }

    function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
        revert("Soulbound: no approvals");
    }
}
