import {
  useMemo,
  useState,
  useEffect,
  useContext,
  Fragment,
  KeyboardEvent,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Stack, { StackProps } from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Typography, { TypographyProps } from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FlagIcon from "@mui/icons-material/Flag";
import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import { formatDistance } from "date-fns";
import { enqueueSnackbar } from "notistack";
import _ from "lodash";

import { UppercaseRoundBtn } from "@base/Button/RoundBtn";
import Panel from "@base/Panel";
import { CharsiContext } from "@providers/CharsiProvider";
import { ItemType } from "@store/listing/listing.slice";
import {
  getCommentsByListingRewardID,
  createNewComment,
  voteToComment,
  switchMarkInappropriateComment,
} from "@store/listing/listing.api";
import type {
  ListingRewardQueryData,
  RewardQueryData,
  BidQueryData,
  CommentQueryData,
} from "@store/listing/listing.slice";
import type { RootState, AppDispatch } from "@/store";

interface CommentsAndBidsProps {
  listingReward: ListingRewardQueryData;
}

function isBidQueryData(data: any): data is BidQueryData {
  return data.owner !== undefined;
}

function isCommentQueryData(data: any): data is CommentQueryData {
  return data.commenter !== undefined;
}

const ReplyButton = ({ onClick }: TypographyProps) => {
  return (
    <Typography
      variant="body1"
      color="grey"
      onClick={onClick}
      sx={{ display: "flex", alignItems: "flex-end", cursor: "pointer" }}
    >
      Reply
      <svg
        width="15"
        height="12"
        viewBox="0 0 15 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginLeft: "6px" }}
      >
        <path
          d="M1.25 2.48389e-07L1.25 3.72857C1.25 4.5 1.51389 5.15714 2.04167 5.7C2.56945 6.24286 3.20833 6.51429 3.95833 6.51429L12.625 6.51429L9.41667 3.21429L10.2917 2.31428L15 7.15714L10.2917 12L9.41667 11.1L12.625 7.8L3.95833 7.8C2.875 7.8 1.94445 7.40357 1.16667 6.61071C0.388889 5.81786 3.29226e-07 4.85714 2.30563e-07 3.72857L-9.53991e-08 3.57667e-07L1.25 2.48389e-07Z"
          fill="black"
          fillOpacity="0.38"
        />
      </svg>
    </Typography>
  );
};

const FlagInappropriateButton = ({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <Typography
      variant="body1"
      color="grey"
      onClick={onClick}
      sx={{ display: "flex", alignItems: "flex-end", cursor: "pointer" }}
    >
      Flag as inappropriate
      {active === true ? (
        <FlagIcon color="warning" sx={{ fontSize: 18 }} />
      ) : (
        <EmojiFlagsIcon sx={{ fontSize: 18 }} />
      )}
    </Typography>
  );
};

const ItemBid = ({ bid }: { bid: BidQueryData }) => {
  const rewards = [...bid.rewards];
  rewards.sort((a: RewardQueryData, b: RewardQueryData) =>
    a.type === ItemType.BALANCE ? 1 : b.type === ItemType.BALANCE ? -1 : 0
  );

  return (
    <Stack
      direction="row"
      spacing={1}
      borderRadius={2}
      px={1}
      py={0.5}
      width="fit-content"
      alignItems="center"
      sx={{
        background: "rgba(0, 0, 0, 0.87)",
      }}
    >
      <Typography variant="subtitle1" color="#C2C2C2">
        Bid
      </Typography>
      {rewards.map((reward: RewardQueryData, index: number) => (
        <Fragment key={reward.id}>
          {reward.type === ItemType.ITEM ? (
            <Typography variant="subtitle1" color="white">
              {`${_.get(reward, "values.quantity", 0)} ${_.get(
                reward,
                "item.name",
                ""
              )}`}
            </Typography>
          ) : (
            <>
              <Image
                src="/icons/balance.svg"
                width={24}
                height={24}
                alt="balance"
              />
              <Typography variant="subtitle1" color="white">
                {_.get(reward, "balance", 0)}
              </Typography>
            </>
          )}
          {index < rewards.length - 1 && (
            <Typography variant="subtitle1" color="#C2C2C2">
              &
            </Typography>
          )}
        </Fragment>
      ))}
    </Stack>
  );
};

interface CommentOrBidProps extends StackProps {
  listingReward: ListingRewardQueryData;
  commentOrBid: CommentQueryData | BidQueryData;
}

const CommentOrBid = ({
  listingReward,
  commentOrBid,
  ...rest
}: CommentOrBidProps) => {
  const authState = useSelector((state: RootState) => state.auth);
  const { labels } = useContext(CharsiContext);
  const [text, setText] = useState<string>("");
  const [isShowReplyBox, setIsShowReplyBox] = useState<boolean>(false);
  const [isInProgress, setIsInProgress] = useState<boolean>(false);
  const [isInappropriate, setIsInappropriate] = useState<boolean>(
    isCommentQueryData(commentOrBid) && commentOrBid.isInAppropriate
  );
  const dispatch: AppDispatch = useDispatch();

  const handleVoteToComment = (commentID: string) => () => {
    if (!authState.isAuthenticated) {
      enqueueSnackbar(labels.LOGIN_REQUIRED_MESSAGE, { variant: "error" });
      return;
    }

    dispatch(
      voteToComment({
        commentID: commentID,
        onFail: (error: Error) => {
          enqueueSnackbar(error.message, { variant: "error" });
        },
      })
    );
  };

  const handleSwitchShowReplyBox = () => {
    setIsShowReplyBox((prev) => !prev);
  };

  const handleFlagInappropriate = () => {
    if (!authState.isAuthenticated) {
      enqueueSnackbar(labels.LOGIN_REQUIRED_MESSAGE, { variant: "error" });
      return;
    } else if (authState.id !== listingReward.owner.id) {
      enqueueSnackbar(labels.REQUIRED_BE_LISTING_OWNER, { variant: "error" });
      return;
    }

    let oldIsInappropriateState = isInappropriate;
    setIsInappropriate(!oldIsInappropriateState);

    dispatch(
      switchMarkInappropriateComment({
        commentID: commentOrBid.id,
        onFail: (error: Error) => {
          setIsInappropriate(oldIsInappropriateState);
          enqueueSnackbar(error.message, { variant: "error" });
        },
      })
    );
  };

  const handleKeydownReply = (event: KeyboardEvent<Element>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmitReply();
    }
  };

  const handleSubmitReply = () => {
    if (!authState.isAuthenticated) {
      enqueueSnackbar(labels.LOGIN_REQUIRED_MESSAGE, { variant: "error" });
      return;
    }
    if (!text) {
      enqueueSnackbar(labels.REQUIRED_TYPE_COMMENT, { variant: "error" });
      return;
    }

    setIsInProgress(true);

    dispatch(
      createNewComment({
        data: {
          listing_reward: listingReward.id,
          text,
          parent: commentOrBid.id,
        },
        onSuccess: () => {
          setIsInProgress(false);
          setIsShowReplyBox(false);
          setText("");
        },
        onFail: (error: Error) => {
          enqueueSnackbar(error.message, { variant: "error" });
          setIsInProgress(false);
        },
      })
    );
  };

  return (
    <Stack {...rest}>
      <Panel px={3} py={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          {isBidQueryData(commentOrBid) ? (
            <Avatar
              src={_.get(commentOrBid, "owner.avatar.url", "")}
              sx={{ width: 26, height: 26 }}
            />
          ) : (
            <Avatar
              src={_.get(commentOrBid, "commenter.avatar.url", "")}
              sx={{ width: 26, height: 26 }}
            />
          )}
          {isBidQueryData(commentOrBid) ? (
            <Typography variant="subtitle1" color="black" fontWeight={500}>
              {_.get(commentOrBid, "owner.username", "")}
            </Typography>
          ) : (
            <>
              <Typography variant="subtitle1" color="black" fontWeight={500}>
                {_.get(commentOrBid, "commenter.username", "")}
              </Typography>
              {commentOrBid.commenter.id === listingReward.owner.id && (
                <Chip
                  label="Seller"
                  color="primary"
                  sx={{
                    borderRadius: 1.5,
                    width: "fit-content",
                    height: "fit-content",
                    py: 0.5,
                  }}
                />
              )}
            </>
          )}
        </Stack>
        <Stack direction="column" spacing={1} pl="42px">
          <Typography variant="body1" color="text.secondary">
            {formatDistance(new Date(commentOrBid.created_at), new Date())} ago
          </Typography>
          {isBidQueryData(commentOrBid) ? (
            <ItemBid bid={commentOrBid} />
          ) : (
            <Fragment>
              <Typography variant="body1" color="black">
                {commentOrBid.text}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: "fit-content",
                    height: "auto",
                    minWidth: 30,
                    minHeight: 30,
                    color: "rgba(0, 0, 0, 0.6)",
                    fontSize: 14,
                    px: 0.3,
                    cursor: "pointer",
                  }}
                  onClick={handleVoteToComment(commentOrBid.id)}
                >
                  <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                  {commentOrBid.votes.length}
                </Avatar>
                {authState.isAuthenticated &&
                  authState.id !== commentOrBid.commenter.id && (
                    <ReplyButton onClick={handleSwitchShowReplyBox} />
                  )}

                {authState.id !== commentOrBid.commenter.id && (
                  <FlagInappropriateButton
                    active={isInappropriate}
                    onClick={handleFlagInappropriate}
                  />
                )}
              </Stack>
            </Fragment>
          )}
        </Stack>
      </Panel>

      <Collapse in={isShowReplyBox} sx={{ pl: 6 }}>
        <TextField
          label="Add a comment"
          type="text"
          variant="filled"
          rows={4}
          multiline
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeydownReply}
          sx={{ mt: 2 }}
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
          }}
        >
          <UppercaseRoundBtn
            variant="contained"
            color="primary"
            disabled={isInProgress}
            onClick={handleSubmitReply}
            sx={{ padding: "8px 22px" }}
          >
            {isInProgress && (
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            )}
            Submit
          </UppercaseRoundBtn>
        </Box>
      </Collapse>
    </Stack>
  );
};

const CommentsAndBids = ({ listingReward }: CommentsAndBidsProps) => {
  const authState = useSelector((state: RootState) => state.auth);
  const { labels } = useContext(CharsiContext);
  const [text, setText] = useState<string>("");
  const [isCommentsLoaded, setIsCommentsLoaded] = useState<boolean>(false);
  const [isInProgress, setIsInProgress] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

  const handleSubmitComment = () => {
    if (!authState.isAuthenticated) {
      enqueueSnackbar(labels.LOGIN_REQUIRED_MESSAGE, { variant: "error" });
      return;
    }
    if (!text) {
      enqueueSnackbar(labels.REQUIRED_TYPE_COMMENT, { variant: "error" });
      return;
    }

    setIsInProgress(true);

    dispatch(
      createNewComment({
        data: {
          listing_reward: listingReward.id,
          text,
        },
        onSuccess: () => {
          setIsInProgress(false);
          setText("");
        },
        onFail: (error: Error) => {
          enqueueSnackbar(error.message, { variant: "error" });
          setIsInProgress(false);
        },
      })
    );
  };

  const commentsAndBids = useMemo(() => {
    if (!listingReward) return [];

    const all = [
      ...(listingReward.comments || []),
      ...(listingReward.bids || []),
    ];

    all.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return all;
  }, [listingReward]);

  const handleKeyDownComment = async (event: KeyboardEvent<Element>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmitComment();
    }
  };

  useEffect(() => {
    if (listingReward && !isCommentsLoaded) {
      setIsCommentsLoaded(true);
      dispatch(
        getCommentsByListingRewardID({
          listingRewardID: listingReward.id,
        })
      );
    }
  }, [dispatch, isCommentsLoaded, listingReward]);

  if (!listingReward) return;

  return (
    <Stack spacing={3}>
      <Typography variant="h5" mt="50px !important">
        Comments & Bids
      </Typography>
      {(() => {
        let clonedCommentsAndBids = [...commentsAndBids];

        const getCommentDescendants = (comment: CommentQueryData) => {
          const nodes = [];

          const getCommentChild = (
            parentComment: CommentQueryData,
            index: number
          ) => {
            const childComments = clonedCommentsAndBids.filter(
              (comment: CommentQueryData) =>
                comment.parent && comment.parent.id === parentComment.id
            );

            if (childComments.length === 0) return;

            childComments.forEach((childComment: CommentQueryData) => {
              const childIndex = clonedCommentsAndBids.findIndex(
                (comment: CommentQueryData) => comment.id === childComment.id
              );

              clonedCommentsAndBids.splice(childIndex, 1);

              nodes.push(
                <CommentOrBid
                  key={childComment.id}
                  listingReward={listingReward}
                  commentOrBid={childComment}
                  sx={{ pl: 4 * index }}
                />
              );

              getCommentChild(childComment, index + 1);
            });
          };

          getCommentChild(comment, 1);

          return nodes;
        };

        return commentsAndBids.map(
          (commentOrBid: CommentQueryData | BidQueryData) => {
            if (
              isBidQueryData(commentOrBid) ||
              (isCommentQueryData(commentOrBid) && commentOrBid.parent === null)
            ) {
              const index = clonedCommentsAndBids.findIndex(
                (clonedCommentOrBid: CommentQueryData | BidQueryData) =>
                  clonedCommentOrBid.id === commentOrBid.id
              );

              clonedCommentsAndBids.splice(index, 1);

              return (
                <Fragment key={commentOrBid.id}>
                  <CommentOrBid
                    listingReward={listingReward}
                    commentOrBid={commentOrBid}
                  />
                  {isCommentQueryData(commentOrBid) &&
                    getCommentDescendants(commentOrBid)}
                </Fragment>
              );
            }
          }
        );
      })()}

      {authState.id && (
        <Fragment>
          <TextField
            label="Add a comment"
            type="text"
            variant="filled"
            rows={4}
            multiline
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDownComment}
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <UppercaseRoundBtn
              variant="contained"
              color="primary"
              disabled={isInProgress}
              onClick={handleSubmitComment}
              sx={{ padding: "8px 22px" }}
            >
              {isInProgress && (
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              )}
              Submit
            </UppercaseRoundBtn>
          </Box>
        </Fragment>
      )}
    </Stack>
  );
};

export default CommentsAndBids;
