IF EXISTS (	SELECT sysobjects.id FROM sysobjects WHERE sysobjects.name = 'EComm_PING'		) DROP PROCEDURE EComm_PING
IF EXISTS (	SELECT sysobjects.id FROM sysobjects WHERE sysobjects.name = 'EComm_DATA_GET'	) DROP PROCEDURE EComm_DATA_GET

#END_BAT#

/****** Object:  StoredProcedure [dbo].[EComm_PING]    Script Date: 2022. 07. 01. 12:06:14 ******/
SET ANSI_NULLS ON
#END_BAT#

SET QUOTED_IDENTIFIER ON
#END_BAT#

CREATE PROCEDURE [dbo].[EComm_PING]
@OUT_HTTP_Code			INT				OUTPUT,
@OUT_HTTP_Message		NVARCHAR(MAX)	OUTPUT

AS

SELECT		@OUT_HTTP_Code		= 200,
			@OUT_HTTP_Message	= ''

RETURN	-1
#END_BAT#

/****** Object:  StoredProcedure [dbo].[EComm_DATA_GET]    Script Date: 2022. 07. 01. 12:05:39 ******/
SET ANSI_NULLS ON
#END_BAT#

SET QUOTED_IDENTIFIER ON
#END_BAT#

CREATE PROCEDURE [dbo].[EComm_DATA_GET]
@WhereQuery							NVARCHAR(MAX),
@SELECT								NVARCHAR(MAX),
@TOP								INT				= 0,
@FROM								NVARCHAR(MAX),
@WHERE								NVARCHAR(MAX)	= '',
@GROUP_BY							NVARCHAR(MAX)	= '',
@ORDER_BY							NVARCHAR(MAX)	= '',
@Lang								NVARCHAR(10)	= '',
@PAGE_NO							INT				= 0,
@ROWS_PER_PAGE						INT				= 0,

@OUT_HTTP_Code						INT				= 0		OUTPUT,
@OUT_HTTP_Message					NVARCHAR(MAX)	= ''	OUTPUT

AS

DECLARE @OUT				INT				= -1
DECLARE @SQL				NVARCHAR(MAX)	= N'
SELECT		@TOP @SELECT
FROM		@FROM
@WHERE
@GROUP_BY
ORDER BY	@ORDER_BY
@OFFSET
'

DECLARE @OFFSET								NVARCHAR(MAX)	= ''
DECLARE @TOP_STR							NVARCHAR(MAX)	= ''

SELECT	@WhereQuery						= LTRIM(RTRIM(ISNULL(@WhereQuery, ''))),
		@SELECT							= ISNULL(@SELECT, '') + ' ',
		@TOP							= ISNULL(@TOP, 0),
		@FROM							= ISNULL(@FROM, ''),
		@WHERE							= CASE
											WHEN LTRIM(RTRIM(ISNULL(@WHERE, ''))) > '' THEN ' WHERE ' + @WHERE + ' '
											ELSE ''
										  END,
		@GROUP_BY						= CASE
											WHEN LTRIM(RTRIM(ISNULL(@GROUP_BY, ''))) > '' THEN ' GROUP BY ' + @GROUP_BY + ' '
											ELSE ''
										  END,
		@ORDER_BY						= ISNULL(@ORDER_BY, '') + ' ',
		@Lang							= ISNULL(@Lang, 'en'),
		@PAGE_NO						= ISNULL(@PAGE_NO, 0),
		@ROWS_PER_PAGE					= ISNULL(@ROWS_PER_PAGE, 0),

		@OUT_HTTP_Code					= 400,
		@OUT_HTTP_Message				= ''


IF @PAGE_NO > 0 AND @ROWS_PER_PAGE > 0
   BEGIN
		SELECT	@OFFSET	= 'OFFSET @PAGE_NO ROWS FETCH FIRST @ROWS_PER_PAGE ROWS ONLY'
		SELECT	@OFFSET	= REPLACE(@OFFSET, '@PAGE_NO', @PAGE_NO)
		SELECT	@OFFSET	= REPLACE(@OFFSET, '@ROWS_PER_PAGE', @ROWS_PER_PAGE)
   END

IF @TOP > 0
   BEGIN
		SELECT	@TOP_STR	= 'TOP @TOP'
		SELECT	@TOP_STR	= REPLACE(@TOP_STR, '@TOP', @TOP)
   END

SELECT	@SQL = REPLACE(@SQL, '@SELECT',							@SELECT)
SELECT	@SQL = REPLACE(@SQL, '@TOP',							@TOP_STR)
SELECT	@SQL = REPLACE(@SQL, '@FROM',							@FROM)
SELECT	@SQL = REPLACE(@SQL, '@WHERE',							@WHERE)
SELECT	@SQL = REPLACE(@SQL, '@GROUP_BY',						@GROUP_BY)
SELECT	@SQL = REPLACE(@SQL, '@ORDER_BY',						@ORDER_BY)
SELECT	@SQL = REPLACE(@SQL, '@OFFSET',							@OFFSET)

EXECUTE (@SQL)

SELECT	@OUT_HTTP_Code		= 200,
		@OUT_HTTP_Message	= ''

RETURN -1
#END_BAT#
